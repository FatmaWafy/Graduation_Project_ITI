from rest_framework import serializers
from .models import Note, PredefinedNotification
from users.models import Instructor, Student

class NotificationSerializer(serializers.ModelSerializer):
    instructor_id = serializers.IntegerField(source="instructor.id",write_only=True)
    student_id = serializers.IntegerField(source="student.id",write_only=True) 

    class Meta:
        model = Note
        fields = ['id', 'message', 'created_at', 'instructor_id', 'student_id', 'instructor', 'student']

class PredefinedNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedNotification
        fields = ['id', 'message']
