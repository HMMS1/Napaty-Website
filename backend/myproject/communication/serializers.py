from django.contrib.auth.models import User
from rest_framework import serializers
from accounts.models import Profile
from .models import ConsultationRequest, Message

class ExpertListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="profile.full_name", required=False)
    specialization = serializers.CharField(source="profile.specialization", required=False)
    experience_years = serializers.IntegerField(source="profile.experience_years", required=False)

    class Meta:
        model = User
        fields = ("id", "email", "full_name", "specialization", "experience_years")


class ConsultationRequestCreateSerializer(serializers.ModelSerializer):
    expert_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ConsultationRequest
        fields = ("id", "expert_id", "status", "created_at")
        read_only_fields = ("id", "status", "created_at")

    def validate_expert_id(self, value):
        if self.context["request"].user.id == value:
            raise serializers.ValidationError("You can't create request to yourself")

        try:
            expert = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Expert not found")

        if not hasattr(expert, "profile") or expert.profile.user_type != "expert":
            raise serializers.ValidationError("Selected user is not an expert")

        return value

    def create(self, validated_data):
        expert_id = validated_data.pop("expert_id")
        expert = User.objects.get(id=expert_id)
        user = self.context["request"].user
        return ConsultationRequest.objects.create(user=user, expert=expert)


class ConsultationRequestListSerializer(serializers.ModelSerializer):
    expert = ExpertListSerializer(read_only=True)

    class Meta:
        model = ConsultationRequest
        fields = ("id", "status", "created_at", "expert")


class MessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.email", read_only=True)

    class Meta:
        model = Message
        fields = ("id", "request", "sender_email", "text", "created_at")
        read_only_fields = ("id", "request", "sender_email", "created_at")

class UserMiniSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="profile.full_name", required=False)

    class Meta:
        model = User
        fields = ("id", "email", "full_name")
        
class ConsultationRequestListForExpertSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = ConsultationRequest
        fields = ("id", "status", "created_at", "user")
