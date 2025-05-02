from django.db import models
from django.contrib.auth.models import User
from django.db import models
from users.models import Student, Instructor ,Track
from django.conf import settings  # أضف هذا الاستيراد في الأعلى

class Note(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='sent_notes', null=True, blank=True)
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)  # 👈 ده اللي ضفناه
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        if self.student and self.instructor:
            return f"Note from {self.instructor.user.username} to {self.student.user.username}"
        elif self.track and self.instructor:
            return f"Note from {self.instructor.user.username} to Track {self.track.name}"
        return "Note"

class PredefinedNotification(models.Model):
    message = models.TextField(unique=True)   
    created_at = models.DateTimeField(auto_now_add=True)   

    def __str__(self):
        return self.message

class PushSubscription(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # استخدم هذا بدلاً من 'auth.User'
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    subscription = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Subscription for {self.user.username if self.user else 'anonymous'}"