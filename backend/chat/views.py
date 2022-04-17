from ctypes.wintypes import HPALETTE
from statistics import mode
from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
import json
import secrets
from . import models
from django.shortcuts import render


def index(request):
    return render(request, 'chat/index.html', {})

def chooseroom(request):
    return render(request, 'chat/chooseroom.html', {})

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })

def createRoom(request):
    if request.method == 'GET':
        return HttpResponse(status=404)
    elif request.method == 'POST':
    # 获取表单的数据
        body_dict = json.loads(request.body.decode('utf-8'))
        title = body_dict.get('title', '')
        print("title", title)

        try:
            room = models.ChatRoom.objects.get(title=title)
            return HttpResponse("Chat Room Already Exist", status=405)
        except:
            pass


        # 验证用户名，密码是否正确
        # try:
        host_uid = request.COOKIES.get('uid', '')
        token = secrets.token_bytes(16)
        print("uid", host_uid, 'room_name', token)

        host_user = models.User.objects.get(uid=host_uid)
        room = models.ChatRoom.objects.create(
            title=title,
            room_name = token,
            host_user = host_user
        )
        room.save()
        # room.members.add(host_user)
        room.save()

        res = HttpResponse("Successfully Create ChatRoom",status=200)

        print('title ', title, 'room_id', token)
    
        return res
        # except:
        #     return HttpResponse("Create ChatRoom Fail", status=403)

