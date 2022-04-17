# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('createRoom/', views.createRoom, name='createRoom'),
    path('<str:room_name>/', views.room, name='room'),
]

