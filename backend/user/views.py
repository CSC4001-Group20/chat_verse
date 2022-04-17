from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from . import models
# Create your views here.

def login(request):
    if request.method == 'GET':
            username = request.COOKIES.get('username', '')
            return render(request, 'user/login.html', locals())
    elif request.method == 'POST':
        # 获取表单的数据
        remember = request.POST.get('remember', '')
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        # 验证用户名，密码是否正确
        try:
            user = models.User.objects.get(name=username,password=password)
            # 在当前连接的Session中记录当前用户的信息
            request.session['userinfo'] = {
                "username": user.name,
                'id': user.id
            }
        except:
            return HttpResponse("登陆失败")

        # 处理COOKIES
        resp = HttpResponse('登陆成功')
        if remember:
            resp.set_cookie('username', username, 7*24*60*60)
        else:
            resp.delete_cookie('username')
        return resp



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
