from rest_framework import serializers
from .models import Note,Student,PredefinedNotification
 
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class PredefinedNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedNotification
        fields = ['id', 'message']