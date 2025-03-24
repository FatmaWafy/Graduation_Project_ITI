from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Note, Student, PredefinedNotification
from django.contrib.auth.models import User
from .serializers import StudentSerializer, NotificationSerializer, PredefinedNotificationSerializer


class NotificationListCreateView(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NotificationSerializer


class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class PredefinedNotificationListCreateView(generics.ListCreateAPIView):
    queryset = PredefinedNotification.objects.all()
    serializer_class = PredefinedNotificationSerializer