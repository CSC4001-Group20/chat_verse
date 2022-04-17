# chat/urls.py
from tkinter.tix import Select
from django.urls import path
from . import views

urlpatterns = [
    path('chooseroom/', views.chooseroom, name='chooseroom'),
    path('<str:room_name>/', views.room, name='room'),
    path('Manage_my_Verse/',views.Manage_my_Verse)
    path('Select_a_Verse/',views.Select_a_Verse)
]

