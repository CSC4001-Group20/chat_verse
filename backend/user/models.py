from django.db import models

# Create your models here.


# the class constructs the schema of User is database, which include serval attributes
class User(models.Model):
    uid = models.AutoField(primary_key=True)
    user_name = models.CharField('username', max_length=30, unique=True)
    password = models.CharField('password', max_length=30)
    email = models.CharField('email', max_length=100, null=True)



# the class constructs the schema of Email is database, which include serval attributes
class EmailCode(models.Model):
    email = models.CharField('email', max_length=100)
    code = models.CharField('code', max_length=6)
