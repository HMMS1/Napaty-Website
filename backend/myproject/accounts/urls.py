from django.urls import path
from .views import register_api, login_api, me_api
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("api/auth/register/", register_api),
    path("api/auth/login/", login_api),
    path("api/auth/me/", me_api),

    path("api/token/refresh/", TokenRefreshView.as_view()),
]