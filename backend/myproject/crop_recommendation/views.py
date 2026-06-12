import requests
from decouple import config

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


CROP_AI_API_URL = "https://katyy20-newai.hf.space"



def get_weather_data(governorate):
    api_key = config("WEATHER_API_KEY", default="")

    if not api_key:
        raise ValueError("WEATHER_API_KEY is missing in .env")

    governorate_mapping = {
        "cairo": "30.0444,31.2357",
        "giza": "30.0131,31.2089",
        "alexandria": "31.2001,29.9187",
        "dakahlia": "31.0364,31.3807",
        "red_sea": "27.2579,33.8116",
        "beheira": "31.0341,30.4682",
        "fayoum": "29.3084,30.8428",
        "gharbia": "30.8754,31.0335",
        "ismailia": "30.5965,32.2715",
        "menoufia": "30.5549,31.0124",
        "minya": "28.1099,30.7503",
        "qalyubia": "30.3292,31.2165",
        "new_valley": "25.4516,30.5464",
        "suez": "29.9668,32.5498",
        "aswan": "24.0889,32.8998",
        "assiut": "27.1800,31.1837",
        "beni_suef": "29.0661,31.0994",
        "port_said": "31.2653,32.3019",
        "damietta": "31.4165,31.8133",
        "sharqia": "30.5877,31.5020",
        "south_sinai": "27.9158,34.3299",
        "kafr_sheikh": "31.1107,30.9399",
        "matrouh": "31.3543,27.2373",
        "luxor": "25.6872,32.6396",
        "qena": "26.1551,32.7160",
        "north_sinai": "31.1313,33.7984",
        "sohag": "26.5591,31.6957",
    }

    query = governorate_mapping.get(governorate)
    if not query:
        raise ValueError("Invalid governorate")

    response = requests.get(
        "http://api.weatherapi.com/v1/current.json",
        params={"key": api_key, "q": query, "aqi": "no"},
        timeout=10,
    )
    response.raise_for_status()

    data = response.json()

    if "error" in data:
        raise ValueError(data["error"].get("message", "Weather API error"))

    temperature = round(float(data["current"]["temp_c"]))
    humidity = round(float(data["current"]["humidity"]))
    rainfall = round(float(data["current"]["precip_mm"]), 1)

    return temperature, humidity, rainfall



def build_model_input(governorate, soil_type, season):
    governorate_defaults = {
        "cairo": {"sunlight": 10},
        "giza": {"sunlight": 10},
        "alexandria": {"sunlight": 8},
        "dakahlia": {"sunlight": 9},
        "red_sea": {"sunlight": 11},
        "beheira": {"sunlight": 9},
        "fayoum": {"sunlight": 10},
        "gharbia": {"sunlight": 9},
        "ismailia": {"sunlight": 10},
        "menoufia": {"sunlight": 9},
        "minya": {"sunlight": 10},
        "qalyubia": {"sunlight": 10},
        "new_valley": {"sunlight": 12},
        "suez": {"sunlight": 10},
        "aswan": {"sunlight": 11},
        "assiut": {"sunlight": 11},
        "beni_suef": {"sunlight": 10},
        "port_said": {"sunlight": 8},
        "damietta": {"sunlight": 8},
        "sharqia": {"sunlight": 9},
        "south_sinai": {"sunlight": 11},
        "kafr_sheikh": {"sunlight": 8},
        "matrouh": {"sunlight": 8},
        "luxor": {"sunlight": 11},
        "qena": {"sunlight": 11},
        "north_sinai": {"sunlight": 9},
        "sohag": {"sunlight": 11},
    }

    season_adjustments = {
        "summer": {"sunlight": 2},
        "winter": {"sunlight": -2},
        "spring": {"sunlight": 1},
        "autumn": {"sunlight": 0},
    }

    soil_ph_defaults = {
        "sandy": 6.2,
        "clay": 7.0,
        "loamy": 6.5,
        "silty": 6.7,
    }

    if governorate not in governorate_defaults:
        raise ValueError("Invalid governorate")

    if season not in season_adjustments:
        raise ValueError("Invalid season")

    if soil_type not in soil_ph_defaults:
        raise ValueError("Invalid soil type")

    temperature, humidity, rainfall = get_weather_data(governorate)

    sunlight = governorate_defaults[governorate]["sunlight"] + season_adjustments[season]["sunlight"]
    ph = soil_ph_defaults[soil_type]

    return {
        "soil_type": soil_type,
        "season": season,
        "temperature": max(5, min(45, int(temperature))),
        "humidity": max(10, min(95, int(humidity))),
        "rainfall": max(0, min(200, float(rainfall))),
        "ph": ph,
        "sunlight": max(4, min(12, int(sunlight))),
    }



@api_view(["POST"])
@permission_classes([AllowAny])
def crop_recommendation_view(request):
    try:
        governorate = request.data.get("governorate")
        soil_type = request.data.get("soil_type")
        season = request.data.get("season")

        if not governorate or not soil_type or not season:
            return Response(
                {"error": "governorate, soil_type, and season are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        model_input = build_model_input(governorate, soil_type, season)

        ai_response = requests.post(
            f"{CROP_AI_API_URL}/predict-basic",
            json=model_input,
            timeout=60,
        )

        ai_response.raise_for_status()
        ai_result = ai_response.json()

        return Response(
            {
                "recommended_crop": ai_result.get("recommended_crop"),
                "recommended_crops": ai_result.get("recommended_crops", []),
                "input_used": model_input,
            },
            status=status.HTTP_200_OK,
        )

    except requests.exceptions.RequestException as e:
        return Response(
            {"error": f"Crop AI API connection error: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )



@api_view(["POST"])
@permission_classes([AllowAny])
def crop_recommendation_advanced(request):
    try:
        data = request.data

        required_fields = ["N", "P", "K", "temperature", "humidity", "rainfall", "ph"]

        for field in required_fields:
            if data.get(field) is None:
                return Response(
                    {"error": f"{field} is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        payload = {
            "N": float(data.get("N")),
            "P": float(data.get("P")),
            "K": float(data.get("K")),
            "temperature": float(data.get("temperature")),
            "humidity": float(data.get("humidity")),
            "rainfall": float(data.get("rainfall")),
            "ph": float(data.get("ph")),
        }

        ai_response = requests.post(
            f"{CROP_AI_API_URL}/predict-advanced",
            json=payload,
            timeout=60,
        )

        ai_response.raise_for_status()
        ai_result = ai_response.json()

        return Response(
            {
                "recommended_crop": ai_result.get("recommended_crop"),
                "recommended_crops": ai_result.get("recommended_crops", []),
                "input_used": payload,
            },
            status=status.HTTP_200_OK,
        )

    except ValueError as e:
        return Response(
            {"error": f"Invalid input value: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except requests.exceptions.RequestException as e:
        return Response(
            {"error": f"Crop AI API connection error: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )



AGRI_KEYWORDS = [
    "زراعة", "ازرع", "أزرع", "محصول", "محاصيل", "تربة", "ري", "سماد", "تسميد",
    "نبات", "نباتات", "بذور", "بذرة", "حصاد", "آفات", "حشرات", "فطريات",
    "أمراض النبات", "مبيد", "مخصبات", "رطوبة", "حرارة", "ph",
    "شتلات", "شتلة", "إنبات", "انبات", "تقويم زراعي", "موسم الزراعة",
    "ميعاد الزراعة", "موعد الزراعة", "كيف أزرع", "كيفية زراعة", "طريقة زراعة",
    "صوبة", "صوب", "زراعة عضوية", "نقص العناصر", "اصفرار", "ذبول",
    "تقليم", "تلقيح", "نمو النبات", "إنتاجية", "محاصيل خضر", "محاصيل فاكهة",
    "crop", "crops", "soil", "irrigation", "fertilizer", "plant", "plants",
    "pest", "disease", "harvest", "seeds", "humidity", "temperature",
    "agriculture", "farming", "cultivation", "how to grow", "planting",
    "soil type", "seed", "seedling", "greenhouse", "watering", "compost",
    "nutrients", "deficiency", "farm", "crop production"
]


def is_agriculture_question(message):
    if not message:
        return False

    text = str(message).strip().lower()
    return any(term.lower() in text for term in AGRI_KEYWORDS)


def ask_groq_agri(message, language="ar"):
    api_key = config("GROQ_API_KEY", default="").strip()

    if not api_key:
        raise ValueError("GROQ_API_KEY is missing in .env")

    url = "https://api.groq.com/openai/v1/chat/completions"

    system_prompt = (
        "أنت مساعد متخصص في كل ما يخص الزراعة. "
        "أجب عن جميع الأسئلة المتعلقة بالزراعة بشكل واضح وعملي ومبسط. "
        "يشمل ذلك: كيفية زراعة المحاصيل، مواعيد الزراعة، أنواع التربة، الري، التسميد، "
        "أمراض النبات، الآفات، المبيدات، الحصاد، التخزين، المناخ الزراعي، الصوب الزراعية، "
        "زراعة الخضروات، زراعة الفواكه، المحاصيل الحقلية، النباتات الطبية والعطرية، "
        "إنبات البذور، العناية بالنبات، مشاكل النمو، نقص العناصر، وتحسين الإنتاجية. "
        "إذا سأل المستخدم عن طريقة زراعة أي محصول، اشرح له الخطوات من البداية للنهاية بشكل مرتب. "
        "وإذا كان السؤال خارج مجال الزراعة تمامًا، قل فقط: أنا مساعد متخصص في الزراعة فقط. "
        "لا تخترع معلومات، وإذا لم تكن متأكدًا فقل ذلك بوضوح. "
        "اجعل الإجابة قصيرة أو متوسطة حسب السؤال، وواضحة وعملية."
        if language == "ar"
        else
        "You are an assistant specialized in everything related to agriculture. "
        "Answer all agriculture-related questions clearly, practically, and simply. "
        "This includes: how to grow crops, planting times, soil types, irrigation, fertilization, "
        "plant diseases, pests, pesticides, harvesting, storage, agricultural climate, greenhouses, "
        "vegetable farming, fruit farming, field crops, medicinal and aromatic plants, "
        "seed germination, plant care, growth problems, nutrient deficiencies, and yield improvement. "
        "If the user asks how to grow any crop, explain the process step by step from start to finish. "
        "If the question is completely outside agriculture, reply only: I am an agriculture-only assistant. "
        "Do not make up facts, and if unsure, say so clearly. "
        "Keep the answer clear, practical, and concise or moderate depending on the question."
    )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": str(message)},
        ],
        "temperature": 0.3,
        "max_completion_tokens": 400,
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)

    if not response.ok:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text
        raise ValueError(f"Groq error {response.status_code}: {error_data}")

    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


@api_view(["POST"])
@permission_classes([AllowAny])
def agri_chat_view(request):
    try:
        message = request.data.get("message", "")
        language = request.data.get("language", "ar")

        if not message or not str(message).strip():
            return Response(
                {"error": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        groq_reply = ask_groq_agri(message, language)

        return Response(
            {"reply": groq_reply},
            status=status.HTTP_200_OK,
        )

    except requests.exceptions.RequestException as e:
        return Response(
            {"error": f"Groq API connection error: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
