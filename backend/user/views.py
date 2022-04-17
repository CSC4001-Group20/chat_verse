
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from . import models
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
            user = models.User.objects.get(user_name=username,password=password)
            res = HttpResponse("Successfully Login",status=200)
            token = secrets.token_bytes(16)
            print('用户登录, 用户名称', user.user_name, 'new token=',token)
            res.set_cookie('token',token)
            res.set_cookie('uid', user.uid)
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

        # 开始注册功能
        try:
            user = models.User.objects.create(
                user_name=username,
                password=password,
            )
            return HttpResponse("Successfully Sign", status=200)
        except:
            return HttpResponse("Sign Fail", status=403)
