from ast import Return
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.http import HttpResponseRedirect
from matplotlib.pyplot import get
from .models import *
from chat.models import *
# Create your views here.
import secrets
import json

#email part
from smtplib import SMTP_SSL
from email.mime.text import MIMEText
from email.header import Header
from random import randint


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
        email = body_dict.get('email', '')
        code = body_dict.get('code', '')


        try:
            User.objects.get(email=email)
            return HttpResponse("Same Email for Another User", code=403)
        except: 
            pass

        if User.objects.filter(email=email).count() > 0:
            return HttpResponse("Same Email for Another User", code=403)

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
            email = email,
        )
        return HttpResponse("Successfully Sign", status=200)
        #except:
        #return HttpResponse("Sign Fail", status=403)



def avatar(request):
    if request.method=='GET':
        if request.GET.get('uid'):
            uid = request.GET.get('uid')
            user = User.objects.get(uid=uid)
            try:
                avatar = user.avatar.all()[0]
            except:
                try:
                    avatar = Avatar.objects.all()[0]
                    user.avatar.add(avatar)
                except:
                    avatar, c = Avatar.objects.get_or_create(
                        title='Default Avatar',
                        src="https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981",
                        cover='https://cd-1302933783.cos.ap-guangzhou.myqcloud.com/Screen%20Shot%202022-04-18%20at%208.46.20%20PM.png'
                    )
                    avatar.save()
                    user.avatar.add(avatar)
                    user.save()
            print(avatar)
            avatar_info = {
                'title':avatar.title,
                'src':avatar.src,
                'cover':avatar.cover
            }
            return JsonResponse({'result':avatar_info})
        # elif request.GET.get('uid_collected'):
        #     uid = request.GET.get('uid_collected')
        #     cookie_uid = request.COOKIES.get('uid')
        #     if (uid != cookie_uid):
        #         return HttpResponse("用户错误",status=404)


        #     user = User.objects.get(uid=uid)
        #     avatars = user.collected_avatar.all()
        #     # TODO  
        #     avatar_info_list = []
        #     return JsonResponse({'result':avatar_info})
        else:
            # Get All Avatars
            avatars = Avatar.objects.all()
            #TODO 
            avatar_info =[]
            for avatar in avatars:
                result = {}
                result['id'] = avatar.id
                result['title'] = avatar.title
                result['src'] = avatar.src
                result['cover'] = avatar.cover
                # result['creator'] = avatar.creator.user_name
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

        print(body_dict)

        avatar = Avatar.objects.create(
            title = body_dict.get('title', ''),
            src = body_dict.get('src', ''),
            cover = body_dict.get('cover', ''),
            creator = user,
        )
        avatar.save()
        # avatar.owning_users.add(user)
        user.avatar.clear()
        user.avatar.add(avatar)
        avatar.save()

        return HttpResponse(status=200)

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
    if request.method=='POST':
        body_dict = json.loads(request.body.decode('utf-8'))
        uid = body_dict.get('uid', '')
        avatar_id = body_dict.get('avatar_id', '')

        avatar = Avatar.objects.get(pk=avatar_id)
        user = User.objects.get(uid=uid)

        user.avatar.clear()
        user.avatar.add(avatar)
        user.save()
        return HttpResponse(status=200)

# TODO @GLH
def send_email(email, code):
    print(email, code)
    host_server = 'smtp.qq.com'
    sender_qq = '3162557172'
    pwd = 'xmngaqidumdrdefe'
    sender_qq_mail = '3162557172@qq.com'

    smtp = SMTP_SSL(host_server)
    smtp.ehlo(host_server)
    smtp.login(sender_qq, pwd)
    # mail_content = "Test"
    receiver='1291683680@qq.com'
    mail_content = """
        Welcome To ChatVerse!
        Your Email Verification Code is  
    """
    mail_content += code

    try:
        msg = MIMEText(mail_content, "plain", 'utf-8')
        msg["Subject"] = Header("Char Verse Validation Email", 'utf-8')
        msg["From"] = "Char Verse Validation"
        msg["To"] = receiver
        smtp.sendmail(sender_qq_mail, receiver, msg.as_string())
        print("Send successfully -- " + receiver)
        return HttpResponse("Send Email", status=200)
    except:
        print("Send Error unsuccessfully -- " + receiver)
        print("sendMail-Error: Email send fail")
    return True

def send_email_request(request):
    if request.method=='POST':
        body_dict = json.loads(request.body.decode('utf-8'))
        email = body_dict.get('email')

        if User.objects.filter(email=email).count() > 0:
            return HttpResponse("Same Email for Another User", code=403)


        code = secrets.token_urlsafe(6)
        emailcode, c = EmailCode.objects.get_or_create(email=email)
        emailcode.code = code
        emailcode.save()
        success = send_email(email, code)
        if success:
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=403)

def change_pwd(request):
    if request.method=='POST':
        body_dict = json.loads(request.body.decode('utf-8'))
        uid = request.COOKIES.get('uid')
        old_password = body_dict.get('old_password')
        new_password = body_dict.get('new_password')

        user = User.objects.get(uid=uid)

        if old_password==user.password:
            user.password = new_password
            user.save()
            return HttpResponse(status=200)
        else:
            print(user.password)
            print(old_password)
            print(new_password)
            return HttpResponse(status=403)