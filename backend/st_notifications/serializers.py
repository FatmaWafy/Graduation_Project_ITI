from rest_framework import serializers
from .models import Note, PredefinedNotification
from users.models import Instructor, Student

class NotificationSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.user.username', read_only=True)
    student_id = serializers.IntegerField(source="student.id", read_only=True)  # Make this read-only

    class Meta:
        model = Note
        fields = ['id', 'message', 'created_at', 'read', 'instructor_name', 'student_id']


class PredefinedNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedNotification
        fields = ['id', 'message']
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'