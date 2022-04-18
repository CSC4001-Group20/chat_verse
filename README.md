# ChatVerse Project

Copyright @ YHW, WYF, GLH, CZF for CSC4001 Cource 2022, CUHK(SZ).


## How To Run:

frontend (half finished):
```
$ cd frontend
$ yarn install
$ yarn start
```
 You will see the browser pop up and the tracking demo show up.
 ![Demo Image](https://cd-1302933783.cos.ap-guangzhou.myqcloud.com/FILE%2FScreen%20Shot%202022-03-16%20at%2011.42.21%20PM.png)
 
 
backend (currently a socket Demo):
```
$ pip install django
$ pip install channels
$ cd /backend
$ python3 manage.py runserver
```
Open your browser and get in http://127.0.0.1:8000/chat/chatroom1 which means you enter a chatroom called chatroom1



HOW TO RUN

This program require serval package, detail packages show above
If you want to test on your own computer, you need 'nginx'

```
$ brew install nginx
```

after you installed nginx, you are required to modify the nginx config file to achieve port listen and transfer, go to your local nginx.conf(usually in ./etc/nginx/), add an statement in nginx.conf

```
include /Your own path/chat_verse/nginx.conf;
```

After you finished above steps, you can check the result soon

```
cd backend
python3 manage.py makemigrations user
python3 manage.py makemigrations chat
python3 manage.py migrate
python3 manage.py runserver
```

```
cd frontend
yarn install
yarn start
```

You can check localhost:666 to see the result