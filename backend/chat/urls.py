# chat/urls.py
from tkinter.tix import Select
from django.urls import path
from . import views

urlpatterns = [
    path('createRoom/', views.createRoom, name='createRoom'),
    path('joinRoom/', views.joinRoom, name='joinRoom'),
    path('startRoom/', views.startRoom, name='startRoom'),
    path('get_personal_verse_list/',views.get_personal_verse_list, name='get_personal_verse_list'),
    path('deleteRoom/', views.deleteRoom, name='deleteRoom'),
    path('verse_list/',views.verse_list, name='verse_list'),
    path('<str:room_name>/', views.room, name='room'),
]

