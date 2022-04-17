from telnetlib import STATUS
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from py import code
from . import models
# Create your views here.
import secrets

def login(request):

    if request.method == 'POST':
        # 获取表单的数据
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        print(username, password)

        # 验证用户名，密码是否正确
        try:
            user = models.User.objects.get(name=username,password=password)
            res = HttpResponse("Successfully Login",status=200)
            token = secrets.token_bytes(16)
            print('用户登录, 用户名称', user.username, '新token=',token)
            res.set_cookie('token',token)
            res.set_cookie('uid', user.uid)
            return res
        except:
            return HttpResponse("Login Fail", status=403)



def register(request):
    if request.method == 'GET':
        return render(request, 'user/register.html')
    elif request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        password2 = request.POST.get('password2', '')
        if username == '':
            username_error = "用户名不能为空"
            return render(request, 'user/register.html', locals())
        if password == '':
            password_error = "密码不能为空"
            return render(request, 'user/register.html', locals())
        if password != password2:
            password2_error = "两次密码不一致"
            return render(request, 'user/register.html', locals())
        
        # 开始注册功能
        try:
            user = models.User.objects.create(
                name=username,
                password=password
            )
     
            return HttpResponse("<h2>注册成功</h2>")
        except:
            return HttpResponse("<h2>注册失败</h2>")
