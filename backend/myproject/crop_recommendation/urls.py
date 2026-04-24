from django.urls import path
from .views import crop_recommendation_view, crop_recommendation_advanced, agri_chat_view
urlpatterns = [
    path("crop-recommendation/", crop_recommendation_view, name="crop-recommendation"),
    path("crop-recommendation-advanced/", crop_recommendation_advanced, name="crop-recommendation-advanced"),
    path("agri-chat/", agri_chat_view, name="agri-chat"),
]