from django.db import models
from django.contrib.auth.models import User
from django.db import models
from users.models import Student, Instructor   

class Note(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)  
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='sent_notes', null=True, blank=True)  
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note from {self.instructor.user.username} to {self.student.user.username}"

class PredefinedNotification(models.Model):
    message = models.TextField(unique=True)   
    created_at = models.DateTimeField(auto_now_add=True)   

    def __str__(self):
        return self.message