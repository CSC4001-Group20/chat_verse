from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField('username', max_length=30, unique=True)
    
    password = models.CharField('password', max_length=30)

    def __str__(self):
        return self.name

    def create(self, username, password):
        self.name = username
        self.password = password
        print("model create")
        return "OK"
    
