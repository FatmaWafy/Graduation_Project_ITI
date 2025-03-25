from rest_framework import status, generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Note, PredefinedNotification
from .serializers import StudentSerializer, NotificationSerializer, PredefinedNotificationSerializer
from users.models import Student, Instructor

class NotificationListCreateView(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NotificationSerializer

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class PredefinedNotificationListCreateView(generics.ListCreateAPIView):
    queryset = PredefinedNotification.objects.all()
    serializer_class = PredefinedNotificationSerializer

class SendNoteView(generics.CreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NotificationSerializer

    def create(self, request, *args, **kwargs):
        instructor_id = request.data.get("instructor_id")
        student_id = request.data.get("student_id")

        if not Instructor.objects.filter(id=instructor_id).exists():
            return Response({"error": f"Instructor with id {instructor_id} not found!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not Student.objects.filter(id=student_id).exists():
            return Response({"error": f"Student with id {student_id} not found!"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)
