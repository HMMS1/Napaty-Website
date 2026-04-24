from django.urls import path
from .views import upload_plant_image, my_plant_images
from .views import analyze_soil, my_soil_analyses

urlpatterns = [
    path("api/diagnosis/upload/", upload_plant_image),
    path("api/diagnosis/my-images/", my_plant_images),
     path("api/soil/analyze/", analyze_soil),
      path("api/soil/analyze/", my_soil_analyses),
     

]