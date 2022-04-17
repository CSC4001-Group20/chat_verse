# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('sign/', views.sign, name='sign'),
]

