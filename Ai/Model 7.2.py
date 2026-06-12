import os
import uuid
import time
import threading
from pathlib import Path
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import timm
from torchvision import models


# =============================================================================
# CONFIG
# =============================================================================
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)

IMG_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD  = [0.229, 0.224, 0.225]

ALLOWED_EXTENSIONS   = {"png", "jpg", "jpeg", "webp", "bmp"}
MAX_CONTENT_LENGTH   = 16 * 1024 * 1024  # 16 MB

MODEL_FILENAMES = {
    "omninet_ev": "hybrid_OmniNetEV.pth",
    "omninet_cs": "hybrid_OmniNetCS.pth",
    "vit":        "base_ViTBase.pth",
    "resnet":     "base_ResNet50.pth",
}

# Ensemble weights
W_OMNINET_EV = 0.30
W_OMNINET_CS = 0.30
W_VIT        = 0.20
W_RESNET     = 0.20

# ── Speed flags ───────────────────────────────────────────────────────────────
USE_FP16     = torch.cuda.is_available()          # half-precision on GPU only
USE_COMPILE  = (
    torch.cuda.is_available()
    and hasattr(torch, "compile")
    and int(torch.__version__.split(".")[0]) >= 2  # torch >= 2.x
)
NUM_THREADS  = min(4, len(MODEL_FILENAMES))        # parallel inference threads

# =============================================================================
# LABELS
# =============================================================================
UNIFIED_CLASSES = [
    "Apple___Scab",
    "Apple___Cedar_Rust",
    "Apple___Healthy",
    "BellPepper___Bacterial_Spot",
    "BellPepper___Healthy",
    "Corn___Gray_Leaf_Spot",
    "Corn___Common_Rust",
    "Corn___Northern_Leaf_Blight",
    "Grape___Black_Rot",
    "Grape___Healthy",
    "Potato___Early_Blight",
    "Potato___Late_Blight",
    "Tomato___Bacterial_Spot",
    "Tomato___Early_Blight",
    "Tomato___Late_Blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_Leaf_Spot",
    "Tomato___Mosaic_Virus",
    "Tomato___Yellow_Leaf_Curl_Virus",
    "Tomato___Healthy",
]

LABEL_MAP    = {cls: idx for idx, cls in enumerate(UNIFIED_CLASSES)}
IDX_TO_CLASS = {idx: cls for cls, idx in LABEL_MAP.items()}
NUM_CLASSES  = len(UNIFIED_CLASSES)


def format_label(raw_label: str) -> dict:
    parts   = raw_label.split("___")
    plant   = parts[0].replace("_", " ").strip()
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
    return {
        "plant":      plant,
        "disease":    disease,
        "is_healthy": "healthy" in disease.lower(),
        "raw":        raw_label,
    }


# =============================================================================
# PREPROCESS  –  reusable compiled transform
# =============================================================================
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(MEAN, STD),
])


def preprocess_image(image_source) -> torch.Tensor:
    """Open image → normalised 1×C×H×W tensor (stays on CPU here)."""
    img = Image.open(image_source).convert("RGB")
    return transform(img).unsqueeze(0)


# =============================================================================
# MODEL DEFINITIONS  (unchanged architecture)
# =============================================================================
class CoordAtt(nn.Module):
    def __init__(self, c, r=32):
        super().__init__()
        mid      = max(8, c // r)
        self.c1  = nn.Conv2d(c, mid, 1, bias=False)
        self.bn  = nn.BatchNorm2d(mid)
        self.act = nn.Hardswish(inplace=True)
        self.ch  = nn.Conv2d(mid, c, 1, bias=False)
        self.cw  = nn.Conv2d(mid, c, 1, bias=False)

    def forward(self, x):
        B, C, H, W = x.shape
        xh = F.adaptive_avg_pool2d(x, (H, 1))
        xw = F.adaptive_avg_pool2d(x, (1, W)).permute(0, 1, 3, 2)
        y  = self.act(self.bn(self.c1(torch.cat([xh, xw], 2))))
        xh, xw = torch.split(y, [H, W], 2)
        return x * torch.sigmoid(self.ch(xh)) * torch.sigmoid(self.cw(xw.permute(0, 1, 3, 2)))


class GeMPool(nn.Module):
    def __init__(self, p=3.0, eps=1e-6):
        super().__init__()
        self.p   = nn.Parameter(torch.tensor(p))
        self.eps = eps

    def forward(self, x):
        return F.adaptive_avg_pool2d(
            x.clamp(min=self.eps).pow(self.p), 1
        ).pow(1 / self.p).flatten(1)


class ChannelAttn(nn.Module):
    def __init__(self, c, r=16):
        super().__init__()
        mid      = max(c // r, 8)
        self.mlp = nn.Sequential(
            nn.Linear(c, mid, bias=False), nn.ReLU(inplace=True), nn.Linear(mid, c, bias=False))

    def forward(self, x):
        a = self.mlp(F.adaptive_avg_pool2d(x, 1).flatten(1))
        m = self.mlp(F.adaptive_max_pool2d(x, 1).flatten(1))
        return x * torch.sigmoid(a + m).unsqueeze(-1).unsqueeze(-1)


class SpatialAttn(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Conv2d(2, 1, 7, padding=3, bias=False)

    def forward(self, x):
        a      = x.mean(1, keepdim=True)
        m, _   = x.max(1, keepdim=True)
        return x * torch.sigmoid(self.conv(torch.cat([a, m], 1)))


class CBAM(nn.Module):
    def __init__(self, c, r=16):
        super().__init__()
        self.ca = ChannelAttn(c, r)
        self.sa = SpatialAttn()

    def forward(self, x):
        return self.sa(self.ca(x))


class CrossAttnGate(nn.Module):
    def __init__(self, dim=512, heads=8):
        super().__init__()
        assert dim % heads == 0
        self.h  = heads
        self.sc = (dim // heads) ** -0.5
        self.q1 = nn.Linear(dim, dim, bias=False); self.k2 = nn.Linear(dim, dim, bias=False)
        self.v2 = nn.Linear(dim, dim, bias=False); self.o1 = nn.Linear(dim, dim, bias=False)
        self.q2 = nn.Linear(dim, dim, bias=False); self.k1 = nn.Linear(dim, dim, bias=False)
        self.v1 = nn.Linear(dim, dim, bias=False); self.o2 = nn.Linear(dim, dim, bias=False)
        self.n1 = nn.LayerNorm(dim)
        self.n2 = nn.LayerNorm(dim)

    def forward(self, a, b):
        B, D = a.shape; H, d = self.h, D // self.h
        q1=self.q1(a).reshape(B,H,d); k2=self.k2(b).reshape(B,H,d); v2=self.v2(b).reshape(B,H,d)
        w1=torch.sigmoid((q1*k2*self.sc).sum(-1,keepdim=True))
        ar=self.n1(a+self.o1((w1*v2).reshape(B,D)))
        q2=self.q2(b).reshape(B,H,d); k1=self.k1(a).reshape(B,H,d); v1=self.v1(a).reshape(B,H,d)
        w2=torch.sigmoid((q2*k1*self.sc).sum(-1,keepdim=True))
        br=self.n2(b+self.o2((w2*v1).reshape(B,D)))
        return ar, br


# ── Checkpoint helpers ────────────────────────────────────────────────────────

def _unwrap(ckpt):
    if isinstance(ckpt, dict):
        for k in ("state_dict", "model_state_dict", "model"):
            if k in ckpt:
                ckpt = ckpt[k]; break
    if any(k.startswith("module.") for k in ckpt.keys()):
        ckpt = {k.replace("module.", "", 1): v for k, v in ckpt.items()}
    return ckpt


def _get_nc(ckpt: dict) -> int:
    for key in ("head.7.weight", "head.6.weight", "head.4.weight",
                "head.weight", "classifier.weight", "fc.weight"):
        if key in ckpt:
            return ckpt[key].shape[0]
    cands = {k: v for k, v in ckpt.items()
             if k.endswith(".weight") and v.dim() == 2 and v.shape[0] < 200}
    if cands:
        return cands[sorted(cands)[-1]].shape[0]
    raise ValueError("Cannot determine NUM_CLASSES from checkpoint.")


def _load(model, ckpt):
    miss, unexp = model.load_state_dict(ckpt, strict=False)
    if miss:  print(f"    [WARN] missing   ({len(miss)}): {miss[:2]}")
    if unexp: print(f"    [WARN] unexpected({len(unexp)}): {unexp[:2]}")
    model.eval()
    return model


# ── Model classes ─────────────────────────────────────────────────────────────

class OmniNetEV(nn.Module):
    def __init__(self, nc, drop=0.35, proj=512):
        super().__init__()
        self.effnet = timm.create_model('tf_efficientnetv2_s', pretrained=False, num_classes=0, global_pool='')
        self.ca_a   = CoordAtt(1280)
        self.gem_a  = GeMPool()
        self.proj_a = nn.Sequential(nn.Linear(1280,proj), nn.LayerNorm(proj), nn.GELU(), nn.Dropout(drop*0.5))
        self.vit    = timm.create_model('vit_tiny_patch16_224', pretrained=False, num_classes=0)
        self.norm_b = nn.LayerNorm(192)
        self.proj_b = nn.Sequential(nn.Linear(192,proj), nn.LayerNorm(proj), nn.GELU(), nn.Dropout(drop*0.5))
        self.cross  = CrossAttnGate(proj, heads=8)
        self.head   = nn.Sequential(
            nn.Linear(proj*2,512), nn.LayerNorm(512), nn.GELU(), nn.Dropout(drop),
            nn.Linear(512,256),    nn.GELU(),          nn.Dropout(drop/2),
            nn.Linear(256,nc))

    def forward(self, x):
        a = self.proj_a(self.gem_a(self.ca_a(self.effnet.forward_features(x))))
        b = self.proj_b(self.norm_b(self.vit.forward_features(x).mean(1)))
        a, b = self.cross(a, b)
        return self.head(torch.cat([a, b], 1))


def _vec(f):
    if f.dim() == 4:
        _, d1, d2, d3 = f.shape
        return f.mean([1,2]) if d3 >= d1 else f.mean([2,3])
    if f.dim() == 3:
        return f.mean(1)
    return f


class OmniNetCS(nn.Module):
    def __init__(self, nc, drop=0.4, proj=512):
        super().__init__()
        self.convnext = timm.create_model('convnext_tiny', pretrained=False, num_classes=0, global_pool='')
        self.cbam_a   = CBAM(768)
        self.gem_a    = GeMPool()
        self.proj_a   = nn.Sequential(nn.Linear(768,proj), nn.LayerNorm(proj), nn.GELU(), nn.Dropout(drop*0.5))
        self.swin     = timm.create_model('swin_tiny_patch4_window7_224', pretrained=False, num_classes=0)
        self.norm_b   = nn.LayerNorm(768)
        self.proj_b   = nn.Sequential(nn.Linear(768,proj), nn.LayerNorm(proj), nn.GELU(), nn.Dropout(drop*0.5))
        self.cross    = CrossAttnGate(proj, heads=8)
        self.head     = nn.Sequential(
            nn.Linear(proj*2,512), nn.LayerNorm(512), nn.GELU(), nn.Dropout(drop),
            nn.Linear(512,256),    nn.GELU(),          nn.Dropout(drop/2),
            nn.Linear(256,nc))

    def forward(self, x):
        a = self.proj_a(self.gem_a(self.cbam_a(self.convnext.forward_features(x))))
        b = self.proj_b(self.norm_b(_vec(self.swin.forward_features(x))))
        a, b = self.cross(a, b)
        return self.head(torch.cat([a, b], 1))


class ViTBase(nn.Module):
    def __init__(self, nc, drop=0.1):
        super().__init__()
        self.vit  = timm.create_model('vit_base_patch16_224', pretrained=False, num_classes=0, drop_rate=drop)
        self.head = nn.Linear(768, nc)

    def forward(self, x):
        return self.head(self.vit(x))


class ResNet50Base(nn.Module):
    def __init__(self, nc, drop=0.4):
        super().__init__()
        b             = models.resnet50(weights=None)
        self.backbone = nn.Sequential(b.conv1,b.bn1,b.relu,b.maxpool,b.layer1,b.layer2,b.layer3,b.layer4)
        self.pool     = nn.AdaptiveAvgPool2d(1)
        self.head     = nn.Sequential(nn.Dropout(drop), nn.Linear(2048, nc))

    def forward(self, x):
        return self.head(self.pool(self.backbone(x)).flatten(1))


# ── Public loaders ────────────────────────────────────────────────────────────

def _generic_load(ModelCls, path, device, name):
    print(f"  Loading {name} ← {path}")
    t0    = time.time()
    raw   = torch.load(path, map_location="cpu")          # always load to CPU first
    ckpt  = _unwrap(raw if not isinstance(raw, dict) else dict(raw))
    nc    = _get_nc(ckpt)
    print(f"    → {nc} classes | read {time.time()-t0:.1f}s")
    model = ModelCls(nc=nc)
    _load(model, ckpt)
    del ckpt, raw                                          # free RAM early

    # ── optional optimisations ──
    if USE_FP16:
        model = model.half()
    model = model.to(device)

    if USE_COMPILE:
        try:
            model = torch.compile(model, mode="reduce-overhead")
            print(f"    torch.compile ✓ ({name})")
        except Exception as e:
            print(f"    torch.compile skipped: {e}")

    model.eval()
    print(f"    → ready in {time.time()-t0:.1f}s total")
    return model, nc


def _load_model_threaded(ModelCls, path, device, name, results, key):
    try:
        results[key] = _generic_load(ModelCls, path, device, name)
    except Exception as e:
        print(f"  [ERROR] loading {name}: {e}")
        raise


# =============================================================================
# INFERENCE SETUP
# =============================================================================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[inference] device: {DEVICE}  |  fp16={USE_FP16}  |  compile={USE_COMPILE}")

torch.set_num_threads(os.cpu_count() or 4)   # use all CPU cores for CPU ops


# =============================================================================
# RESOLVE MODEL PATHS
# =============================================================================

def get_model_path(filename: str) -> str:
    local_path = BASE_DIR / filename
    if not local_path.is_file():
        raise FileNotFoundError(
            f"Model file not found: {local_path}\n"
            f"Make sure '{filename}' is in the same directory as app.py."
        )
    print(f"[model] Found: {local_path} ({local_path.stat().st_size / 1024 / 1024:.1f} MB)")
    return str(local_path)


# =============================================================================
# PARALLEL MODEL LOADING
# =============================================================================
print("[inference] Loading 4 models in parallel …")
t_load_start = time.time()

_results: dict = {}
_loaders = [
    (OmniNetEV,    get_model_path(MODEL_FILENAMES["omninet_ev"]), "OmniNetEV",  "ev"),
    (OmniNetCS,    get_model_path(MODEL_FILENAMES["omninet_cs"]), "OmniNetCS",  "cs"),
    (ViTBase,      get_model_path(MODEL_FILENAMES["vit"]),        "ViTBase",    "vit"),
    (ResNet50Base, get_model_path(MODEL_FILENAMES["resnet"]),     "ResNet50",   "res"),
]

_threads = []
for (Cls, path, name, key) in _loaders:
    t = threading.Thread(
        target=_load_model_threaded,
        args=(Cls, path, DEVICE, name, _results, key),
        daemon=True,
    )
    t.start()
    _threads.append(t)

for t in _threads:
    t.join()

m_ev,  nc_ev  = _results["ev"]
m_cs,  nc_cs  = _results["cs"]
m_vit, nc_vit = _results["vit"]
m_res, nc_res = _results["res"]

if not (nc_ev == nc_cs == NUM_CLASSES):
    raise RuntimeError(f"NC mismatch! EV={nc_ev} CS={nc_cs} expected={NUM_CLASSES}")

NC = NUM_CLASSES
print(f"[inference] All models loaded in {time.time()-t_load_start:.1f}s | NC={NC}")

ENSEMBLE_MODELS  = [m_ev,        m_cs,        m_vit,  m_res]
ENSEMBLE_WEIGHTS = [W_OMNINET_EV, W_OMNINET_CS, W_VIT, W_RESNET]

# Thread pool reused across requests
_executor = ThreadPoolExecutor(max_workers=NUM_THREADS)


# =============================================================================
# WARMUP  –  run one dummy pass so JIT / compile cache is ready
# =============================================================================
def _warmup():
    print("[warmup] Running warmup pass …")
    t0     = time.time()
    dummy  = torch.zeros(1, 3, IMG_SIZE, IMG_SIZE)
    if USE_FP16:
        dummy = dummy.half()
    dummy  = dummy.to(DEVICE)
    with torch.no_grad():
        for model in ENSEMBLE_MODELS:
            model(dummy)
    print(f"[warmup] Done in {time.time()-t0:.1f}s")

_warmup_thread = threading.Thread(target=_warmup, daemon=True)
_warmup_thread.start()


# =============================================================================
# PREDICT  –  parallel inference
# =============================================================================

def _run_model(args):
    """Run single model – designed for ThreadPoolExecutor."""
    model, tensor = args
    with torch.no_grad():
        return F.softmax(model(tensor), dim=1)[:, :NC]


def predict_image(image_source) -> dict:
    # Pre-process once
    tensor = preprocess_image(image_source).to(DEVICE)
    if USE_FP16:
        tensor = tensor.half()

    # Run all 4 models in parallel
    futures = [
        _executor.submit(_run_model, (model, tensor))
        for model in ENSEMBLE_MODELS
    ]
    probs_list = [f.result() for f in futures]

    # Weighted ensemble
    ensemble = sum(w * p for w, p in zip(ENSEMBLE_WEIGHTS, probs_list))

    top_prob, top_idx = torch.max(ensemble, dim=1)
    pred_label  = IDX_TO_CLASS[top_idx.item()]
    confidence  = round(top_prob.item() * 100, 2)

    top5_probs, top5_idxs = torch.topk(ensemble, k=5, dim=1)
    top5 = [
        {
            "label":      format_label(IDX_TO_CLASS[i.item()]),
            "confidence": round(p.item() * 100, 2),
        }
        for p, i in zip(top5_probs[0], top5_idxs[0])
    ]

    result               = format_label(pred_label)
    result["confidence"] = confidence
    result["top5"]       = top5
    return result


# =============================================================================
# FLASK API
# =============================================================================
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET"])
def health_check():
    warmup_ready = not _warmup_thread.is_alive()
    return jsonify({
        "status":       "running",
        "message":      "Napaty plant disease AI API is running",
        "endpoint":     "/predict",
        "classes":      NUM_CLASSES,
        "device":       str(DEVICE),
        "fp16":         USE_FP16,
        "compiled":     USE_COMPILE,
        "warmup_ready": warmup_ready,
    })


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Send image with form-data key: file"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Use png, jpg, jpeg, webp, or bmp"}), 400

    safe_name = secure_filename(file.filename)
    ext       = safe_name.rsplit(".", 1)[1].lower()
    filename  = f"{uuid.uuid4().hex}.{ext}"
    save_path = UPLOAD_FOLDER / filename

    try:
        file.save(str(save_path))
        t0     = time.time()
        result = predict_image(str(save_path))
        result["inference_ms"] = round((time.time() - t0) * 1000)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        try:
            if save_path.exists():
                save_path.unlink()
        except Exception:
            pass


@app.route("/api/predict", methods=["POST"])
def api_predict():
    return predict()


if __name__ == "__main__":
    _warmup_thread.join()   # block until warmup finishes before accepting traffic
    port = int(os.getenv("PORT", "7860"))
    app.run(host="0.0.0.0", port=port, debug=False)