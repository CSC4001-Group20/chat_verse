rm -rf /db.sqlite3
rm -rf /chat/migrations/
rm -rf /chat/migrations/
python3 manage.py makemigrations user
python3 manage.py makemigrations chat
python3 manage.py migrate
python3 manage.py runserver