from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='note', null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class PredefinedNotification(models.Model):
    message = models.TextField(unique=True)   
    created_at = models.DateTimeField(auto_now_add=True)   

    def __str__(self):
        return self.message