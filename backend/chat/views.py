from turtle import title
from unittest import result
from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

from django.shortcuts import render
from django.db import ChatRoom
from django.db import User

def index(request):
    return render(request, 'chat/index.html', {})

def chooseroom(request):
    return render(request, 'chat/chooseroom.html', {})

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })

def createRoom(request):
    


    return HttpResponse("开房成功")

def Manage_my_Verse(request):
    uid = 0
    print(request.POST.get())
    print(request.body)
    result_rooms = {}
    data_list = ChatRoom.objects.all()
    for room in data_list:
        if room.host_user.uid == uid:
            result = {}
            result["title"] = data_list.title
            result["members"] = data_list.members
            result_rooms.append(room)
    return result

def Select_a_Verse(request):
    result_rooms = []
    data_list = ChatRoom.objects.all()
    for room in data_list:
        result = {}
        result["title"] = room.title
        result["members"] = room.members
        result_rooms.append(result)
    return result_rooms