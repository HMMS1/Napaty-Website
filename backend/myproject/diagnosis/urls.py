from django.urls import path
from .views import (
    upload_plant_image,
    my_plant_images,
    analyze_soil,
    my_soil_analyses,
)

urlpatterns = [
    path("api/diagnosis/upload/", upload_plant_image, name="upload_plant_image"),
    path("api/diagnosis/my-images/", my_plant_images, name="my_plant_images"),

    path("api/soil/analyze/", analyze_soil, name="analyze_soil"),
    path("api/soil/my-analyses/", my_soil_analyses, name="my_soil_analyses"),
]
