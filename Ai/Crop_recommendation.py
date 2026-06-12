from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd

app = Flask(__name__)

MODEL_DIR = "ml_models"

basic_model = joblib.load(os.path.join(MODEL_DIR, "crop_model.pkl"))
soil_encoder = joblib.load(os.path.join(MODEL_DIR, "soil_encoder.pkl"))
season_encoder = joblib.load(os.path.join(MODEL_DIR, "season_encoder.pkl"))
crop_encoder = joblib.load(os.path.join(MODEL_DIR, "crop_encoder.pkl"))

advanced_model = joblib.load(os.path.join(MODEL_DIR, "crop_model_egypt.pkl"))
advanced_encoder = joblib.load(os.path.join(MODEL_DIR, "crop_encoder_egypt.pkl"))


@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Napaty Crop API is running"})


def top_predictions(model, encoder, features, top_n=3):
    probabilities = model.predict_proba(features)[0]
    indices = sorted(range(len(probabilities)), key=lambda i: probabilities[i], reverse=True)[:top_n]

    return [
        {
            "crop": encoder.inverse_transform([i])[0],
            "probability": round(float(probabilities[i]) * 100, 2)
        }
        for i in indices
    ]


@app.route("/predict-basic", methods=["POST"])
def predict_basic():
    data = request.json

    soil_type = data["soil_type"]
    season = data["season"]

    soil_encoded = soil_encoder.transform([soil_type])[0]
    season_encoded = season_encoder.transform([season])[0]

    features = [[
        soil_encoded,
        season_encoded,
        float(data["temperature"]),
        float(data["humidity"]),
        float(data["rainfall"]),
        float(data["ph"]),
        float(data["sunlight"]),
    ]]

    preds = top_predictions(basic_model, crop_encoder, features)

    return jsonify({
        "recommended_crop": preds[0]["crop"],
        "recommended_crops": preds
    })


@app.route("/predict-advanced", methods=["POST"])
def predict_advanced():
    data = request.json

    N = float(data["N"])
    P = float(data["P"])
    K = float(data["K"])
    temperature = float(data["temperature"])
    humidity = float(data["humidity"])
    rainfall = float(data["rainfall"])
    ph = float(data["ph"])

    temp_hum = temperature * humidity / 100
    np_ratio = N / (P + 1)
    nk_ratio = N / (K + 1)
    rain_temp = rainfall * temperature / 100

    features = pd.DataFrame([{
        "N": N,
        "P": P,
        "K": K,
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall,
        "ph": ph,
        "temp_hum": temp_hum,
        "np_ratio": np_ratio,
        "nk_ratio": nk_ratio,
        "rain_temp": rain_temp,
    }])

    preds = top_predictions(advanced_model, advanced_encoder, features)

    return jsonify({
        "recommended_crop": preds[0]["crop"],
        "recommended_crops": preds
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)