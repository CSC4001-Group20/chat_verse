# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('chooseroom/', views.chooseroom, name='chooseroom'),
    path('<str:room_name>/', views.room, name='room'),
]

