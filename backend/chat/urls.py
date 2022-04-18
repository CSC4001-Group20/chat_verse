# chat/urls.py
from tkinter.tix import Select
from django.urls import path
from . import views

urlpatterns = [
    path('createRoom/', views.createRoom, name='createRoom'),
    path('joinRoom/', views.joinRoom, name='joinRoom'),
    path('deleteRoom/', views.deleteRoom, name='deleteRoom'),
    path('verse_list/',views.verse_list, name='verse_list'),
    path('<str:room_name>/', views.room, name='room'),
]

