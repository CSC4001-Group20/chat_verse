# chat/urls.py
from django.urls import path
from . import views



# urlpatterns are used to direct the web requests to backend functions
urlpatterns = [
    path('createRoom/', views.createRoom, name='createRoom'),
    path('joinRoom/', views.joinRoom, name='joinRoom'),
    path('deleteRoom/', views.deleteRoom, name='deleteRoom'),
    path('initSocketCheck/', views.initSocketCheck, name='initSocketCheck'),
    path('verse_list/',views.verse_list, name='verse_list'),
    path('<str:room_name>/', views.room, name='room'),
]
