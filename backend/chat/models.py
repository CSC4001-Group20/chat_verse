
from django.db import models

from user.models import User

# Create your models here.



# the class constructs the schema of ChatRoom is database, which include serval attributes
class ChatRoom(models.Model):
    title = models.TextField(unique=True)
    room_name = models.CharField('room_name', max_length=30, unique=True, primary_key=True)
    host_user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    members = models.ManyToManyField(User, related_name="members")
    is_active = models.BooleanField('is_active', default=False)
    is_delete = models.BooleanField('is_delete', default=False)

# the class constructs the schema of Avatar is database, which include serval attributes
class Avatar(models.Model):
    title = models.TextField(unique=True)
    src = models.TextField(unique=True, null=True)
    cover = models.TextField(null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="contirbuted_avatar")
    owning_users = models.ManyToManyField(User, related_name="collected_avatars")
    using_users = models.ManyToManyField(User, related_name="avatar")
    is_delete = models.BooleanField('is_delete', default=False)

