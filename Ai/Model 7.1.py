import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify, redirect
from PIL import Image
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "plant_disease_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "classes.json")

model = tf.keras.models.load_model(MODEL_PATH, compile=False)
model.make_predict_function()

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
    return redirect("/predict")


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
            <input type="file" name="file" accept="image/*" required>
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
        pred = model.predict(img, verbose=0)

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
    app.run(host="0.0.0.0", port=7860)