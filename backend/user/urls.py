# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('sign/', views.sign, name='sign'),
    path('avatar/', views.avatar, name='avatar'),
    path('collect_avatar/', views.collect_avatar, name='collect_avatar'),
    path('use_avatar/', views.use_avatar, name='use_avatar'),
    path('emailSend/', views.emailSend, name='emailSend')
]

