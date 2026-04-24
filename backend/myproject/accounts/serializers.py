from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField()
    phone = serializers.CharField()
    user_type = serializers.ChoiceField(choices=["user", "expert"])

    # ✅ حقول الخبير (اختيارية)
    experience_years = serializers.IntegerField(required=False, allow_null=True)
    specialization = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("هذا البريد مستخدم بالفعل")
        return email

    def validate(self, attrs):
        # لو Expert لازم يبعت خبرة + تخصص
        if attrs.get("user_type") == "expert":
            if attrs.get("experience_years") in [None, ""]:
                raise serializers.ValidationError({"experience_years": "مطلوب للخبير"})
            if not attrs.get("specialization"):
                raise serializers.ValidationError({"specialization": "مطلوب للخبير"})
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data["password"],
        )

        Profile.objects.create(
            user=user,
            full_name=validated_data["full_name"],
            phone=validated_data["phone"],
            user_type=validated_data["user_type"],
            experience_years=validated_data.get("experience_years"),
            specialization=validated_data.get("specialization"),
        )

        return user


class MeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="profile.full_name", required=False)
    phone = serializers.CharField(source="profile.phone", required=False)
    user_type = serializers.CharField(source="profile.user_type", required=False)

    experience_years = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    specialization = serializers.CharField(
    source="profile.specialization", required=False,
    allow_blank=True,
    allow_null=True
)

    class Meta:
        model = User
        fields = ("id", "email", "full_name", "phone", "user_type", "experience_years", "specialization")