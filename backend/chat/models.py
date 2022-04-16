from pyexpat import model
import django
from django.db import models

from chat_verse.backend.chat.views import room
from chat_verse.backend.user.models import User

# Create your models here.
class ChatRoom(models.Model):

    room_name = models.CharField('room_name', max_length=30, unique=True)
    host_user = models.CharField('host_user', max_length=40)   
    guest_user = models.ForeignKey(User, on_delete=models.SET_NULL, db_column='guest_user', null=True)
    is_active = models.BooleanField('is_active', default=False)

    def create_room(self, room_name, host_user):
        self.room_name = room_name
        self.host_user = host_user
        self.is_active = False
        return room_name + "create successfully"

