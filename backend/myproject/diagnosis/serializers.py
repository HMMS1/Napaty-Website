from rest_framework import serializers
from .models import PlantImage

class PlantImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantImage
        fields = ("id", "image", "created_at")
        read_only_fields = ("id", "created_at")