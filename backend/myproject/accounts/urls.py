from django.urls import path
from .views import (
    register_api,
    login_api,
    me_api,
    request_password_reset_api,
    reset_password_api,
    request_register_api,
    verify_register_api,
    community_posts_api,
    toggle_reaction_api,
    add_comment_api,
    delete_post_api,  rror
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("api/auth/register/request/", request_register_api),
    path("api/auth/register/verify/", verify_register_api),

    path("api/auth/register/", register_api), 
    path("api/auth/login/", login_api),
    path("api/auth/me/", me_api),

    path("api/auth/request-reset/", request_password_reset_api),
    path("api/auth/reset-password/", reset_password_api),

    path("api/token/refresh/", TokenRefreshView.as_view()),

    path("api/community/posts/", community_posts_api),
    path("api/community/posts/<int:post_id>/react/", toggle_reaction_api),
    path("api/community/posts/<int:post_id>/comment/", add_comment_api),
    path("api/community/posts/<int:post_id>/delete/", delete_post_api),
]
