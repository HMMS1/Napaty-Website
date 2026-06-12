import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, MeSerializer, CommunityPostSerializer
from .models import CommunityPost, PostReaction, PostComment


def register_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "تم إنشاء الحساب بنجاح")
            return redirect("home")
        messages.error(request, "فيه خطأ في البيانات")
    else:
        form = UserCreationForm()
    return render(request, "register.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "").strip()
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "تم تسجيل الدخول بنجاح")
            return redirect("home")
        messages.error(request, "بيانات الدخول غير صحيحة")
        return redirect("login")
    return render(request, "login.html")


@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response({
        "message": "registered",
        "user": MeSerializer(user).data,
        "tokens": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "").strip()
    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        return Response({"detail": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
    if not user.check_password(password):
        return Response({"detail": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": MeSerializer(user).data,
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_api(request):
    return Response(MeSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def request_register_api(request):
    email = request.data.get("email", "").strip().lower()
    if User.objects.filter(email__iexact=email).exists():
        return Response(
            {"detail": "البريد الإلكتروني مسجل بالفعل لمستخدم آخر"},
            status=status.HTTP_400_BAD_REQUEST
        )

    code = str(random.randint(100000, 999999))
    cache.set(f'register_{email}', {"data": dict(request.data), "code": code}, timeout=1800)

    send_mail(
        'كود تفعيل حسابك الجديد - نباتي',
        f'مرحباً بك في موقع نباتي. كود تفعيل حسابك الجديد هو: {code}',
        'Napaty <napatywebsite@gmail.com>',
        [email],
        fail_silently=False,
    )
    return Response({"message": "تم إرسال كود التفعيل بنجاح"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_register_api(request):
    email = request.data.get("email", "").strip().lower()
    code = request.data.get("code", "").strip()

    pending_user = cache.get(f'register_{email}')
    if not pending_user or pending_user.get("code") != code:
        return Response(
            {"detail": "كود التفعيل غير صحيح أو منتهي الصلاحية"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user_data = pending_user["data"]
    serializer = RegisterSerializer(data=user_data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    cache.delete(f'register_{email}')
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": MeSerializer(user).data,
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def request_password_reset_api(request):
    email = request.data.get("email", "").strip().lower()
    try:
        user = User.objects.get(email__iexact=email)
        code = str(random.randint(100000, 999999))
        cache.set(f'reset_{email}', code, timeout=1800)
        send_mail(
            'كود استعادة كلمة المرور - نباتي',
            f'كود استعادة كلمة المرور الخاص بك هو: {code}',
            'Napaty <napatywebsite@gmail.com>',
            [email],
            fail_silently=False,
        )
        return Response({"message": "تم إرسال الكود بنجاح"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"detail": "البريد الإلكتروني غير مسجل"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password_api(request):
    email = request.data.get("email", "").strip().lower()
    code = request.data.get("code", "").strip()
    new_password = request.data.get("new_password", "").strip()

    if not email or not code or not new_password:
        return Response(
            {"detail": "برجاء إرسال جميع البيانات المطلوبة"},
            status=status.HTTP_400_BAD_REQUEST
        )

    cached_code = cache.get(f'reset_{email}')
    if cached_code and cached_code == code:
        try:
            user = User.objects.get(email__iexact=email)
            user.set_password(new_password)
            user.save()
            cache.delete(f'reset_{email}')
            return Response({"message": "تم تغيير كلمة المرور بنجاح"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "المستخدم غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    return Response(
        {"detail": "الكود غير صحيح أو منتهي الصلاحية"},
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def community_posts_api(request):
    if request.method == 'GET':
        posts = CommunityPost.objects.all().order_by('-created_at')
        serializer = CommunityPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CommunityPostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_reaction_api(request, post_id):
    post = get_object_or_404(CommunityPost, id=post_id)
    reaction_type = request.data.get('reaction_type', 'like')
    reaction = PostReaction.objects.filter(post=post, user=request.user).first()

    if reaction:
        if reaction.reaction_type == reaction_type:
            reaction.delete()
            return Response({'message': 'Reaction removed'})
        else:
            reaction.reaction_type = reaction_type
            reaction.save()
            return Response({'message': 'Reaction updated'})
    else:
        PostReaction.objects.create(post=post, user=request.user, reaction_type=reaction_type)
        return Response({'message': 'Reaction added'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment_api(request, post_id):
    post = get_object_or_404(CommunityPost, id=post_id)
    content = request.data.get('content')
    if not content or not content.strip():
        return Response(
            {"detail": "التعليق لا يمكن أن يكون فارغاً"},
            status=status.HTTP_400_BAD_REQUEST
        )
    PostComment.objects.create(post=post, author=request.user, content=content.strip())
    return Response({"message": "تم إضافة التعليق"}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post_api(request, post_id):
    post = get_object_or_404(CommunityPost, id=post_id)
    if post.author != request.user:
        return Response(
            {"detail": "غير مسموح لك بحذف هذا المنشور"},
            status=status.HTTP_403_FORBIDDEN
        )
    post.delete()
    return Response({"message": "تم حذف المنشور بنجاح"}, status=status.HTTP_200_OK)
