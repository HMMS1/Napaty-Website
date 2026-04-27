import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "plant_disease_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "classes.json")

model = tf.keras.models.load_model(MODEL_PATH, compile=False)

with open(CLASS_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)

IMG_SIZE = (224, 224)


def preprocess_image(file):
    img = Image.open(file).convert("RGB")
    img = img.resize(IMG_SIZE)
    img = np.array(img)
    img = tf.keras.applications.efficientnet.preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    return img


@app.route("/", methods=["GET"])
def home():
    return """
    <h2>🌿 Plant Disease Detection AI</h2>
    <p>AI service is running successfully ✅</p>
    <a href="/predict">Go to Test Page</a>
    """


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "AI service is running"
    })


@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        return """
        <h2>Upload Image for Prediction</h2>
        <form action="/predict" method="post" enctype="multipart/form-data">
            <input type="file" name="file" required>
            <br><br>
            <button type="submit">Predict</button>
        </form>
        """

    try:
        if "file" not in request.files:
            return jsonify({
                "success": False,
                "error": "No file uploaded"
            }), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({
                "success": False,
                "error": "Empty file name"
            }), 400

        img = preprocess_image(file)
        pred = model.predict(img)

        idx = int(np.argmax(pred))
        confidence = float(np.max(pred))

        return jsonify({
            "success": True,
            "prediction": class_names[idx],
            "confidence": round(confidence, 4),
            "confidence_percent": round(confidence * 100, 2)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)