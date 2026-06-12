import requests
from deep_translator import GoogleTranslator

from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import PlantImage, SoilAnalysis
from .serializers import PlantImageUploadSerializer
from .utils import SOIL_DATA
from .disease_data import DISEASE_INFO


AI_PREDICT_URL = settings.AI_PREDICT_URL


def get_ai_predict_url(model_version):
    if model_version == "7.2":
        return getattr(
            settings,
            "AI_MODEL_72_URL",
            "https://katyy20-napaty-disease-api.hf.space/predict"
        )

    return getattr(
        settings,
        "AI_MODEL_71_URL",
        settings.AI_PREDICT_URL
    )


def clean_ai_text(text):
    if not text:
        return text

    return str(text).replace("___", " ").replace("__", " ").replace("_", " ").strip()


def translate_to_ar(text):
    if not text:
        return text

    try:
        clean_text = clean_ai_text(text)
        return GoogleTranslator(source="auto", target="ar").translate(clean_text)
    except Exception:
        return clean_ai_text(text)


GROQ_API_KEY = ""
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "openai/gpt-oss-20b"


def get_treatment_plan(plant, disease):
    """Call Groq API to get a treatment plan in both Arabic and English."""
    try:
        def call_groq(prompt):
            response = requests.post(
                GROQ_API_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 700,
                    "temperature": 0.5,
                },
                timeout=30,
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"].strip()

        plan_ar = call_groq(
            f"أنت خبير زراعي يتحدث مع مزارع بسيط. النبات: {plant}، المرض: {disease}. "
            f"اكتب بالعربية فقط 10 خطوات علاج عملية ومفصلة وسهلة الفهم. "
            f"كل خطوة تبدأ بـ '-' وتكون جملة كاملة واضحة تشرح ماذا يفعل المزارع بالتحديد. "
            f"لا تكتب عناوين أو أقساماً أو ترقيماً. فقط 10 أسطر كل سطر خطوة."
        )
        plan_en = call_groq(
            f"You are an agricultural expert talking to a simple farmer. Plant: {plant}, Disease: {disease}. "
            f"Write exactly 10 practical, detailed, easy-to-understand treatment steps in English only. "
            f"Each step starts with '-' and is a complete sentence explaining exactly what the farmer should do. "
            f"No headings, no sections, no numbering. Only 10 lines, each line one step."
        )

        return {"ar": plan_ar, "en": plan_en}

    except Exception as e:
        return {
            "ar": "تعذّر جلب خطة العلاج.",
            "en": "Failed to fetch treatment plan.",
            "error": str(e),
        }


def build_translated_prediction(result):
    result_en = {
        "plant": clean_ai_text(result.get("plant", "Unknown")),
        "disease": clean_ai_text(result.get("disease", "Unknown")),
        "diagnosis": clean_ai_text(result.get("diagnosis", "No diagnosis available")),
    }

    if result.get("treatment"):
        result_en["treatment"] = clean_ai_text(result.get("treatment"))

    result_ar = {
        "plant": translate_to_ar(result_en.get("plant")),
        "disease": translate_to_ar(result_en.get("disease")),
        "diagnosis": translate_to_ar(result_en.get("diagnosis")),
    }

    if result_en.get("treatment"):
        result_ar["treatment"] = translate_to_ar(result_en.get("treatment"))

    return {
        "en": result_en,
        "ar": result_ar,
    }


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_plant_image(request):
    serializer = PlantImageUploadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    plant_image = serializer.save(user=request.user)

    model_version = request.data.get("model_version", "7.1")
    AI_PREDICT_URL_SELECTED = get_ai_predict_url(model_version)

    try:
        image_file = plant_image.image
        image_file.open("rb")

        files = {
            "file": (
                image_file.name,
                image_file.read(),
                "image/jpeg",
            )
        }

        ai_response = requests.post(
            AI_PREDICT_URL_SELECTED,
            files=files,
            timeout=120,
        )

        if ai_response.status_code != 200:
            return Response({
                "success": False,
                "message": {
                    "en": "Image uploaded, but AI prediction failed",
                    "ar": "تم رفع الصورة ولكن فشل تشخيص الذكاء الاصطناعي",
                },
                "image": PlantImageUploadSerializer(plant_image).data,
                "ai_error": ai_response.text,
                "ai_url": AI_PREDICT_URL_SELECTED,
                "model_version": model_version,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        ai_data = ai_response.json()

        predicted_class = (
            ai_data.get("prediction")
            or ai_data.get("class_name")
            or ai_data.get("raw")
        )

        confidence = ai_data.get("confidence")
        confidence_percent = ai_data.get("confidence_percent")

        if confidence_percent is None and confidence is not None:
            try:
                confidence_percent = round(float(confidence), 2)
            except Exception:
                confidence_percent = confidence

        if predicted_class in DISEASE_INFO:
            result = DISEASE_INFO.get(predicted_class)
        else:
            result = {
                "plant": clean_ai_text(ai_data.get("plant") or (clean_ai_text(predicted_class).split(" ")[0] if predicted_class else "Unknown")),
                "disease": clean_ai_text(ai_data.get("disease") or predicted_class or "Unknown"),
                "diagnosis": "No diagnosis available",
            }

        translated_prediction = build_translated_prediction(result)

        plant_en = translated_prediction["en"].get("plant", "Unknown")
        disease_en = translated_prediction["en"].get("disease", "Unknown")

        healthy_keywords = {"healthy", "سليم", "normal", "no disease", "none"}
        is_healthy = disease_en.strip().lower() in healthy_keywords

        treatment_plan = None if is_healthy else get_treatment_plan(plant_en, disease_en)

        return Response({
            "success": True,
            "message": {
                "en": "Uploaded and predicted successfully",
                "ar": "تم رفع الصورة وتشخيصها بنجاح",
            },
            "image": PlantImageUploadSerializer(plant_image).data,
            "prediction": translated_prediction,
            "treatment_plan": treatment_plan,
            "ai_result": {
                "class_name": clean_ai_text(predicted_class),
                "confidence": confidence,
                "confidence_percent": confidence_percent,
                "model_version": model_version,
                "ai_url": AI_PREDICT_URL_SELECTED,
                "raw_response": ai_data,
            },
        }, status=status.HTTP_201_CREATED)

    except requests.exceptions.Timeout:
        return Response({
            "success": False,
            "message": {
                "en": "AI service took too long to respond",
                "ar": "خدمة الذكاء الاصطناعي تأخرت في الرد",
            },
            "image": PlantImageUploadSerializer(plant_image).data,
            "error": "AI request timeout",
            "ai_url": AI_PREDICT_URL_SELECTED,
            "model_version": model_version,
        }, status=status.HTTP_504_GATEWAY_TIMEOUT)

    except requests.exceptions.ConnectionError:
        return Response({
            "success": False,
            "message": {
                "en": "Image uploaded, but AI service is not reachable",
                "ar": "تم رفع الصورة ولكن خدمة الذكاء الاصطناعي غير متاحة حالياً",
            },
            "image": PlantImageUploadSerializer(plant_image).data,
            "error": f"Cannot connect to AI service at {AI_PREDICT_URL_SELECTED}",
            "model_version": model_version,
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    except Exception as e:
        return Response({
            "success": False,
            "message": {
                "en": "Image uploaded, but prediction failed",
                "ar": "تم رفع الصورة ولكن فشل التشخيص",
            },
            "image": PlantImageUploadSerializer(plant_image).data,
            "error": str(e),
            "model_version": model_version,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_plant_images(request):
    qs = PlantImage.objects.filter(user=request.user).order_by("-created_at")
    return Response(PlantImageUploadSerializer(qs, many=True).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def analyze_soil(request):
    soil_type = request.data.get("soil_type")

    if not soil_type or soil_type not in SOIL_DATA:
        return Response(
            {"error": "Invalid soil type"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = request.user if request.user.is_authenticated else None

    analysis = SoilAnalysis.objects.create(
        user=user,
        soil_type=soil_type,
    )

    data = SOIL_DATA.get(soil_type, {})

    name = data.get("name", {})
    crops = data.get("crops", {})
    fertilizers = data.get("fertilizers", {})

    if not isinstance(name, dict):
        name = {
            "ar": name or soil_type,
            "en": name or soil_type,
        }

    if not isinstance(crops, dict):
        crops = {
            "ar": crops or [],
            "en": crops or [],
        }

    if not isinstance(fertilizers, dict):
        fertilizers = {
            "ar": fertilizers or [],
            "en": fertilizers or [],
        }

    translations = {
        "ar": {
            "soil_type": name.get("ar", soil_type),
            "plants": crops.get("ar", []),
            "fertilizers": fertilizers.get("ar", []),
        },
        "en": {
            "soil_type": name.get("en", soil_type),
            "plants": crops.get("en", []),
            "fertilizers": fertilizers.get("en", []),
        },
    }

    return Response({
        "id": analysis.id,
        "soil_type": translations["ar"]["soil_type"],
        "plants": translations["ar"]["plants"],
        "fertilizers": translations["ar"]["fertilizers"],
        "translations": translations,
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def my_soil_analyses(request):
    if request.user.is_authenticated:
        analyses = SoilAnalysis.objects.filter(
            user=request.user
        ).order_by("-created_at")
    else:
        analyses = []

    return Response([
        {
            "id": a.id,
            "soil_type": a.get_soil_type_display(),
            "created_at": a.created_at,
        }
        for a in analyses
    ])
