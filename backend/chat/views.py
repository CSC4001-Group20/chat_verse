from cmath import exp
from email.policy import HTTP
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# Create your views here.
import json
import secrets

from . import models


# following three functions are used to do backend websocket testing
def index(request):
    """receive a web request and return the chat index room"""
    return render(request, 'chat/index.html', {})

def chooseroom(request):
    """receive a web request and return the chooseroom room"""
    return render(request, 'chat/chooseroom.html', {})

def room(request, room_name):
    """receive a web request and return the chat room"""
    return render(request, 'chat/room.html', {'room_name': room_name})




# this functions is used to create a websocket channel
def initSocketCheck(request):
    """receive a web request and return the chat room, if error return 404"""
    if request.method == 'GET':
        uid = request.COOKIES.get('uid')
        user = models.User.objects.get(uid=uid)
        user_name = user.user_name
        res = JsonResponse({'user_name':user_name}, status=200)
        return res
    else:
        return HttpResponse(status=404)

# this function is used to create a chatroom 
def createRoom(request):
    """receive a web request and create a chat room, return the chat room"""
    if request.method == 'GET':
        return HttpResponse(status=404)
    elif request.method == 'POST':
        body_dict = json.loads(request.body.decode('utf-8'))
        title = body_dict.get('title', '')

    # check if the chat room already exists
        try:
            room = models.ChatRoom.objects.get(title=title)
            return HttpResponse("Chat Room Already Exist", status=405)
        except:
            pass

        host_uid = request.COOKIES.get('uid', '')
        token = secrets.token_urlsafe(16)
        host_user = models.User.objects.get(uid=host_uid)
        room = models.ChatRoom.objects.create(
            title=title,
            room_name = token,
            host_user = host_user
        )
        room.save()
        room.members.add(host_user)
        room.save()

        res = JsonResponse({'room_name':token}, status=200)
        print('title: ', title, 'room_name: ', token)
        return res

    return HttpResponse("Success")


# this function is used to get the chat room list by a specific user
def get_personal_verse_list(request):
    """receive a web request and return the chat room list by a specific user,"""
    uid = 0
    # print(request.POST.get())
    result_rooms = {}

    data_list = models.User.objects.all()
    for room in data_list:
        if room.host_user.uid == uid:
            result = {}
            result["title"] = data_list.title
            result["n_members"] = data_list.members.count()
            result_rooms.append(room)
    return JsonResponse({'result':result_rooms})



# this function is used to get all chat room list
def verse_list(request):
    """receive a web request and return the chat room list"""
    uid = request.COOKIES.get('uid')
    filter_uid = request.GET.get('filter_uid')=='true'

    result_rooms = []
    data_list = models.ChatRoom.objects.all()
    # print(filter_uid, request.GET.get('filter_uid'))

    if filter_uid:
        data_list = data_list.filter(host_user__uid=uid)

    for room in data_list:
        result = {}
        result["title"] = room.title
        result["room_name"] = room.room_name
        result["n_member"] = room.members.count()
        result_rooms.append(result)

    return JsonResponse({'result':result_rooms})

# this function is used to let user join the chat room
def joinRoom(request):
    """receive a web request and let user join a chat room"""
    if (request.method == 'GET'):
        return HttpResponse("Cannot Join Chat Room", status=404)
    elif (request.method == 'POST'):
        body_dict = json.loads(request.body.decode('utf-8'))
        room_name = body_dict.get('room_name', '')
        chat_room = models.ChatRoom.objects.get(room_name=room_name)
        
        uid = request.COOKIES.get('uid')
        user = models.User.objects.get(uid=uid)
    # make user join chat room
        chat_room.members.add(user)

        print(room_name)
        return HttpResponse(status=200)

# this function is used to let host user delete the room
def deleteRoom(request):
    """receive a web request and delete a chat room"""
    if (request.method == 'GET'):
        return HttpResponse(status=404)
    elif (request.method == 'POST'):
        body_dict = json.loads(request.body.decode('utf-8'))
        room_name = body_dict.get('room_name', '')  
        try:
            models.ChatRoom.objects.filter(room_name=room_name).delete()
            return HttpResponse(status=200)
        except:
            return HttpResponse(status=404)




