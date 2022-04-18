from cmath import exp
from email.policy import HTTP
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# Create your views here.
import json
import secrets

from . import models



def index(request):
    return render(request, 'chat/index.html', {})

def chooseroom(request):
    return render(request, 'chat/chooseroom.html', {})

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })

def initSocketCheck(request):
    if request.method == 'GET':
        uid = request.COOKIES.get('uid')
        user = models.User.objects.get(uid=uid)
        user_name = user.user_name
        res = JsonResponse({'user_name':user_name}, status=200)
        return res
    else:
        return HttpResponse(status=404)


def createRoom(request):
    if request.method == 'GET':
        return HttpResponse(status=404)
    elif request.method == 'POST':
    # 获取表单的数据
        body_dict = json.loads(request.body.decode('utf-8'))
        title = body_dict.get('title', '')
        # print("title", title)

        try:
            room = models.ChatRoom.objects.get(title=title)
            return HttpResponse("Chat Room Already Exist", status=405)
        except:
            pass

        # 验证用户名，密码是否正确
        # try:
        host_uid = request.COOKIES.get('uid', '')
        token = secrets.token_urlsafe(16)
        # print("uid", host_uid, 'room_name', token)
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
        # except:s
        #     return HttpResponse("Create ChatRoom Fail", status=403)
    return HttpResponse("开房成功")

def get_personal_verse_list(request):
    uid = 0
    print(request.POST.get())
    result_rooms = {}
    data_list = models.User.objects.all()
    for room in data_list:
        if room.host_user.uid == uid:
            result = {}
            result["title"] = data_list.title
            result["n_members"] = data_list.members.count()
            result_rooms.append(room)
    return JsonResponse({'result':result_rooms})

def verse_list(request):
    
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

    # json_data = json.dumps(result_rooms)
    # print(result)
    return JsonResponse({'result':result_rooms})

def joinRoom(request):
    if (request.method == 'GET'):
        return HttpResponse("Cannot Join Chat Room", status=404)
    elif (request.method == 'POST'):
        body_dict = json.loads(request.body.decode('utf-8'))
        room_name = body_dict.get('room_name', '')
        chat_room = models.ChatRoom.objects.get(room_name=room_name)
        
        uid = request.COOKIES.get('uid')
        user = models.User.objects.get(uid=uid)
        chat_room.members.add(user)

        print(room_name)
        return HttpResponse(status=200)

def deleteRoom(request):
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




