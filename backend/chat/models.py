from io import open_code
from tkinter import CASCADE
from django.db import models

from user.models import User

# Create your models here.
class ChatRoom(models.Model):
    title = models.TextField()
    room_name = models.CharField('room_name', max_length=30, unique=True)
    host_user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    members = models.ManyToManyField('self')
    is_active = models.BooleanField('is_active', default=False)
    is_delete = models.BooleanField('is_delete', default=False)

