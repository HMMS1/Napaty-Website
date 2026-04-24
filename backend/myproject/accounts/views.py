from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, MeSerializer


# ===== HTML views  =====
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


# ===== API views =====
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