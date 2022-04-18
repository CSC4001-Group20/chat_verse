from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.http import HttpResponseRedirect
from matplotlib.pyplot import get
from .models import *
from chat.models import *
# Create your views here.
import secrets
import json

def login(request):
    if request.method == 'POST':
        # 获取表单的数据
        body_dict = json.loads(request.body.decode('utf-8'))
        username = body_dict.get('username', '')
        password = body_dict.get('password', '')

        print("username", username, "password", password)

        # 验证用户名，密码是否正确
        try:
            user = User.objects.get(user_name=username,password=password)
            res = HttpResponse("Successfully Login",status=200)
            token = secrets.token_urlsafe(16)
            print('用户登录, 用户名称', user.user_name, 'new token=',token)
            res.set_cookie('token',token)
            res.set_cookie('uid', user.uid)
            print('uid', user.uid)
            return res
        except:
            return HttpResponse("Login Fail", status=403)


def sign(request):
    if request.method == 'GET':
        return render(request, 'user/register.html')
    elif request.method == 'POST':
        body_dict = json.loads(request.body.decode('utf-8'))
        username = body_dict.get('username', '')
        password = body_dict.get('password', '')

        if username == "":
            username_error = "username is empty"
            return HttpResponse("username is not empty", status=405)
        if password == "":
            password_error = "password is empty"
            return HttpResponse("password is not empty", status=405)
    
        print("username", username, "password", password)

        try:
            user1 = models.User.objects.get(user_name=username)
            return HttpResponse("Successfully Sign", status=403)
        except:
            pass

        # 开始注册功能
        #try:
        user = User.objects.create(
            user_name=username,
            password=password,
        )
        return HttpResponse("Successfully Sign", status=200)
        #except:
        #return HttpResponse("Sign Fail", status=403)




def avatar(request):
    if request.method=='GET':
        if request.GET.get('uid'):
            uid = request.GET.get('uid')
            user = User.objects.get(uid=uid)
            avatar = user.avatar.all()[0]
            print(avatar)
            # TODO 将 Avatar内关键信息提取进 Avatar Info


            avatar_info = {}
            return JsonResponse({'result':avatar_info})
        elif request.GET.get('uid_collected'):
            uid = request.GET.get('uid_collected')
            cookie_uid = request.COOKIES.get('uid')
            if (uid != cookie_uid):
                return HttpResponse("用户错误",status=404)


            user = User.objects.get(uid=uid)
            avatars = user.collected_avatar.all()
            # TODO  
            avatar_info_list = []
            return JsonResponse({'result':avatar_info})
        else:
            # Get All Avatars
            avatars = Avatar.objects.all()
            #TODO 
            avatar_info =[]
            for avatar in avatars:
                result = {}
                result['title'] = avatar.title
                result['src'] = avatar.src
                result['creator'] = avatar.creator.user_name
                result['n_owning_users'] = avatar.owning_users.count()
                result['n_using_users'] = avatar.using_users.count()
                result['is_delete'] = avatar.is_delete
                avatar_info.append(result)

            return JsonResponse({'result':avatar_info})

    elif request.method=='POST':
        uid = request.COOKIES.get('uid')
        body_dict = json.loads(request.body.decode('utf-8'))
        # TODO Create A Single Avatar
        user = User.objects.get(uid=uid)

        avatar = Avatar.objects.create(
            title = body_dict.get('title', ''),
            src = body_dict.get('src', ''),
            creator = user,
        )
        avatar.save()
        avatar.owning_users.add(user)
        avatar.save()

        return HttpResponse(status=404)

def collect_avatar(request):
    if request.method=='POST':
        uid = request.COOKIES.get('uid')
        # uid = 0 # TODO
        body_dict = json.loads(request.body.decode('utf-8'))
        avatar_title = body_dict.get('title', '')

        # avatar_id = 0 #TODO
        user = User.objects.get(uid=uid)
        avatar = Avatar.objects.get(title=avatar_title)
        user.collected_avatar.add(avatar)
        user.save()
        return HttpResponse(status=200)

def use_avatar(request):
    if request.method=='GET':
        uid = request.COOKIES.get('uid')
        # uid = 0 # TODO
        user = User.objects.get(uid=uid)
        data_list = Avatar.objects.all()

        data_list = data_list.filter(using_users=user)
        
        # avatar_id = 0 #TODO

        avatar = data_list[0]
        # user.avatar.clear()
        # user.avatar.add(avatar)
        res = JsonResponse({'result_title':avatar.title, 'result_src':avatar.src}, status=200)
        return res