from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.models import Instructor, Student  # Import Instructor and Student from users app
from st_notifications.models import Note , PredefinedNotification
from st_notifications.serializers import NotificationSerializer, PredefinedNotificationSerializer
from rest_framework import generics, serializers  # DRF classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from .serializers import StudentSerializer
from django.urls import path
from .views import StudentListCreateView

# SendNotificationView

# from rest_framework.permissions import AllowAny

class SendNotificationView(APIView):
    permission_classes = [AllowAny]  # Disable authentication

    def post(self, request):
        """Allows instructors to send notes to students without authentication."""
        
        # Retrieve data from request
        instructor_id = request.data.get("instructor_id")  
        student_id = request.data.get("student_id")
        message = request.data.get("message")

        # Ensure required fields are provided
        if not all([instructor_id, student_id, message]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        instructor = get_object_or_404(Instructor, id=instructor_id)  # Fetch instructor by ID
        student = get_object_or_404(Student, id=student_id)  # Fetch student by ID

        # Create Note
        note = Note.objects.create(
            instructor=instructor,
            student=student,
            message=message
        )

        return Response(
            {"message": "Note sent successfully!", "note": NotificationSerializer(note).data},
            status=status.HTTP_201_CREATED
        )


class StudentNotificationListView(ListAPIView):
    """List all notifications for the logged-in student."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter notifications for the logged-in student."""
        return Note.objects.filter(receiver__user=self.request.user).order_by("-timestamp")

    
    
# class NotificationListCreateView(generics.ListCreateAPIView):
#     queryset = Note.objects.all()
#     serializer_class = NotificationSerializer

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class PredefinedNotificationListCreateView(generics.ListCreateAPIView):
    queryset = PredefinedNotification.objects.all()
    serializer_class = PredefinedNotificationSerializer

# class SendNoteView(generics.CreateAPIView):
#     queryset = Note.objects.all()
#     serializer_class = NotificationSerializer

#     def create(self, request, *args, **kwargs):
#         instructor_id = request.data.get("instructor_id")
#         student_id = request.data.get("student_id")

#         if not Instructor.objects.filter(id=instructor_id).exists():
#             return Response({"error": f"Instructor with id {instructor_id} not found!"}, status=status.HTTP_400_BAD_REQUEST)
        
#         if not Student.objects.filter(id=student_id).exists():
#             return Response({"error": f"Student with id {student_id} not found!"}, status=status.HTTP_400_BAD_REQUEST)

#         return super().create(request, *args, **kwargs)
