from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import PlantImage, SoilAnalysis
from .serializers import PlantImageUploadSerializer
from .utils import SOIL_DATA
from .disease_data import DISEASE_INFO



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_plant_image(request):
    serializer = PlantImageUploadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    plant_image = serializer.save(user=request.user)

    predicted_class = "Tomato___Late_blight"

    result = DISEASE_INFO.get(predicted_class, {
        "plant": "Unknown",
        "disease": "Unknown",
        "diagnosis": "No diagnosis available"
    })

    return Response({
        "message": "uploaded successfully",
        "image": PlantImageUploadSerializer(plant_image).data,
        "prediction": result
    }, status=201)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_plant_images(request):
    qs = PlantImage.objects.filter(user=request.user).order_by("-created_at")
    return Response(PlantImageUploadSerializer(qs, many=True).data)



@api_view(["POST"])
@permission_classes([AllowAny])  # ✅ بدون login
def analyze_soil(request):
    soil_type = request.data.get("soil_type")

    if not soil_type or soil_type not in SOIL_DATA:
        return Response(
            {"error": "Invalid soil type"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ حل مشكلة Anonymous user
    user = request.user if request.user.is_authenticated else None

    analysis = SoilAnalysis.objects.create(
        user=user,
        soil_type=soil_type
    )

    data = SOIL_DATA.get(soil_type, {})

    return Response({
        "id": analysis.id,
        "soil_type": data.get("name", soil_type),
        "plants": data.get("crops", []),
        "fertilizers": data.get("fertilizers", [])
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
            "created_at": a.created_at
        }
        for a in analyses
    ])