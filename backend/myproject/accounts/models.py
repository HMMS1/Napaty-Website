from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    USER_TYPES = (
        ("user", "User"),
        ("expert", "Expert"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    user_type = models.CharField(max_length=10, choices=USER_TYPES)

    # ✅ حقول الخبير
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    specialization = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.full_name} ({self.user_type})"