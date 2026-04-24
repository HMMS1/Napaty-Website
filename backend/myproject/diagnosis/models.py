from django.db import models
from django.contrib.auth.models import User



class PlantImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="plant_images")
    image = models.ImageField(upload_to="plant_images/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PlantImage #{self.id} - {self.user.email}"


class SoilAnalysis(models.Model):
    SOIL_TYPES = [
        ("sandy", "رملية"),
        ("clay", "طينية"),
        ("silty", "سلتية"),
        ("loamy", "طميية"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="soil_analyses",
        null=True,   # ✅ مهم
        blank=True   # ✅ مهم
    )

    soil_type = models.CharField(max_length=20, choices=SOIL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email if self.user else 'Anonymous'} - {self.soil_type}"