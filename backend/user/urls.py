# chat/urls.py
from django.urls import path
from . import views




# urlpatterns are used to direct the web requests to backend functions
urlpatterns = [
    path('login/', views.login, name='login'),
    path('sign/', views.sign, name='sign'),
    path('avatar/', views.avatar, name='avatar'),
    path('collect_avatar/', views.collect_avatar, name='collect_avatar'),
    path('use_avatar/', views.use_avatar, name='use_avatar'),
    path('send_email/', views.send_email_request, name='send_email'),
    path('change_pwd/', views.change_pwd, name='change_pwd'),
]

