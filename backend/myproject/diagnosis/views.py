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
            AI_PREDICT_URL,
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
                "ai_url": AI_PREDICT_URL,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        ai_data = ai_response.json()

        predicted_class = ai_data.get("prediction")
        confidence = ai_data.get("confidence")
        confidence_percent = ai_data.get("confidence_percent")

        result = DISEASE_INFO.get(predicted_class, {
            "plant": clean_ai_text(predicted_class).split(" ")[0] if predicted_class else "Unknown",
            "disease": clean_ai_text(predicted_class) if predicted_class else "Unknown",
            "diagnosis": "No diagnosis available",
        })

        translated_prediction = build_translated_prediction(result)

        return Response({
            "success": True,
            "message": {
                "en": "Uploaded and predicted successfully",
                "ar": "تم رفع الصورة وتشخيصها بنجاح",
            },
            "image": PlantImageUploadSerializer(plant_image).data,
            "prediction": translated_prediction,
            "ai_result": {
                "class_name": clean_ai_text(predicted_class),
                "confidence": confidence,
                "confidence_percent": confidence_percent,
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
            "ai_url": AI_PREDICT_URL,
        }, status=status.HTTP_504_GATEWAY_TIMEOUT)

    except requests.exceptions.ConnectionError:
        return Response({
            "success": False,
            "message": {
                "en": "Image uploaded, but AI service is not reachable",
                "ar": "تم رفع الصورة ولكن خدمة الذكاء الاصطناعي غير متاحة حالياً",
            },
            "image": PlantImageUploadSerializer(plant_image).data,
            "error": f"Cannot connect to AI service at {AI_PREDICT_URL}",
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

    return Response({
        "id": analysis.id,
        "soil_type": data.get("name", soil_type),
        "plants": data.get("crops", []),
        "fertilizers": data.get("fertilizers", []),
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
