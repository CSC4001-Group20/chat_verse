from base64 import encode
from http import cookies
from http.cookiejar import Cookie
import json
from tokenize import cookie_re
from django.test import TestCase
from http.cookies import SimpleCookie

# Create your tests here.
from .models import User
from chat.models import Avatar
import json


class UserTestCase(TestCase):

    def test_send_email_and_sign_up(self):

        eml = '119010377@link.cuhk.edu.cn'

        response = self.client.post('/user/send_email/',json.dumps({
            'email':eml
        }), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        code = response.content.decode('utf-8')

        # Test Sign Up
        response = self.client.post('/user/sign/', json.dumps({
            'username': 'testuser',
            'password': 'testpwd',
            'code': code,
            'email': eml
        }), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        # Test Login
        response = self.client.post('/user/login/', json.dumps({
            'username': 'testuser',
            'password': 'testpwd',
        }), content_type="application/json")
        self.assertEqual(response.status_code, 200)


        # Test Sign Up Duplicate Usernames
        response = self.client.post('/user/sign/', json.dumps({
            'username': 'testuser',
            'password': 'testpwd',
            'code': code,
            'email': eml
        }), content_type="application/json")
        self.assertEqual(response.status_code, 403)


        # Test Sign Up With Wrong Email Code
        response = self.client.post('/user/sign/', json.dumps({
            'username': 'testuser',
            'password': 'testpwd',
            'code': code[:-2],
            'email': eml
        }), content_type="application/json")
        self.assertEqual(response.status_code, 403)

class AvatarTestCase(TestCase):
    
    def setUp(self):
        eml = '119010377@link.cuhk.edu.cn'

        response = self.client.post('/user/send_email/',json.dumps({
            'email':eml
        }), content_type="application/json")

        code = response.content.decode('utf-8')

        response = self.client.post('/user/sign/', json.dumps({
            'username': 'testuser',
            'password': 'testpwd',
            'code': code,
            'email': eml
        }), content_type="application/json")
    
    def test_create_and_get_avatar(self):

        # An Empty Database has no avatar info
        response = self.client.get('/user/avatar/')
        result = response.json()['result']
        self.assertEqual(len(result), 0)

        # With a get request, a default Avatar is created
        default_avatar = {'title': 'Default Avatar', 'src': 'https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981', 'cover': 'https://cd-1302933783.cos.ap-guangzhou.myqcloud.com/Screen%20Shot%202022-04-18%20at%208.46.20%20PM.png'}

        response = self.client.get('/user/avatar/?uid=1')
        result = response.json()['result']
        self.assertDictEqual(result, default_avatar)
        
        # Try Create a new avatar
        self.client.cookies = SimpleCookie({'uid': '1'})
        response = self.client.post('/user/avatar/', json.dumps({
            'title': 'test_avatar',
            'src': '/url/to/test_avatar.vrm',
            'cover': '/url/to/test_avatar_cover.png',
        }), content_type="application/json")

        self.assertEqual(Avatar.objects.count(), 2)




