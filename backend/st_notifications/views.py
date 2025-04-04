from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.models import Instructor, Student  # Import Instructor and Student from users app
from st_notifications.models import Note , PredefinedNotification
from st_notifications.serializers import NotificationSerializer, PredefinedNotificationSerializer, StudentSerializer
from rest_framework import generics, serializers  # DRF classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

class SendNotificationView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'head', 'options']

    def post(self, request):
        """Allows instructors to send notes to students without authentication."""

        # Retrieve data from request
        instructor_id = request.data.get("instructor_id")
        student_id = request.data.get("student_id")
        message = request.data.get("message")

        # Ensure required fields are provided
        if not all([instructor_id, student_id, message]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch instructor by ID
        instructor = get_object_or_404(Instructor, id=instructor_id)
        student = get_object_or_404(Student, id=student_id)

        # Create Note
        note = Note.objects.create(
            instructor=instructor,
            student=student,
            message=message
        )

        # Serialize the note and add instructor info to the response
        response_data = NotificationSerializer(note).data
        response_data["instructor_name"] = instructor.user.username
        response_data["instructor_id"] = instructor.id

        return Response(
            {"message": "Note sent successfully!", "note": response_data},
            status=status.HTTP_201_CREATED
        )

class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Note, id=pk, student__user=request.user)
        notification.read = True
        notification.save()  
        return Response({"message": "Notification marked as read."}, status=status.HTTP_200_OK)
    
class MarkAllNotificationsAsReadView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request):
        student = get_object_or_404(Student, user=request.user)
        Note.objects.filter(student=student, read=False).update(read=True)
        return Response({"message": "All notifications marked as read."}, status=status.HTTP_200_OK)

class StudentNotificationListView(ListAPIView):
    """List all notifications for the logged-in student."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student = Student.objects.get(user=self.request.user)  
        print(student)
        return Note.objects.filter(student_id=student.id).order_by("-created_at")
    
class PredefinedNotificationListCreateView(generics.ListCreateAPIView):
    queryset = PredefinedNotification.objects.all()
    serializer_class = PredefinedNotificationSerializer

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


