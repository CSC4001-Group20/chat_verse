from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

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
    


    return HttpResponse("开房成功")