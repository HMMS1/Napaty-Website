from django.contrib.auth.models import User
from rest_framework import serializers
from django.db import transaction
from .models import Profile, CommunityPost, PostReaction, PostComment


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField()
    user_type = serializers.ChoiceField(choices=["user", "expert"])

    experience_years = serializers.IntegerField(required=False, allow_null=True)
    specialization = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("هذا البريد مستخدم بالفعل")
        return email

    def validate(self, attrs):
        if attrs.get("user_type") == "expert":
            if attrs.get("experience_years") in [None, ""]:
                raise serializers.ValidationError({"experience_years": "مطلوب للخبير"})
            if not attrs.get("specialization"):
                raise serializers.ValidationError({"specialization": "مطلوب للخبير"})
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()

        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=validated_data["password"],
            )

            Profile.objects.create(
                user=user,
                full_name=validated_data["full_name"],
                user_type=validated_data["user_type"],
                experience_years=validated_data.get("experience_years"),
                specialization=validated_data.get("specialization"),
            )
        return user


class MeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="profile.full_name", required=False)
    user_type = serializers.CharField(source="profile.user_type", required=False)
    experience_years = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    specialization = serializers.CharField(
        source="profile.specialization", required=False, allow_blank=True, allow_null=True
    )

    class Meta:
        model = User
        fields = ("id", "email", "full_name", "user_type", "experience_years", "specialization")


class PostCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.profile.full_name', read_only=True)
    author_type = serializers.CharField(source='author.profile.user_type', read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'author_name', 'author_type', 'content', 'created_at']


class CommunityPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.profile.full_name', read_only=True)
    author_type = serializers.CharField(source='author.profile.user_type', read_only=True)
    reactions_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    comments = PostCommentSerializer(many=True, read_only=True)
    is_author = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author_name', 'author_type', 'content', 'image',
            'created_at', 'reactions_count', 'user_reaction', 'comments', 'is_author'
        ]

    def get_reactions_count(self, obj):
        from django.db.models import Count
        counts = obj.reactions.values('reaction_type').annotate(count=Count('reaction_type'))
        return {c['reaction_type']: c['count'] for c in counts}

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            if reaction:
                return reaction.reaction_type
        return None

    def get_is_author(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author == request.user
        return False
