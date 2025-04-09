from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.models import Instructor, Student , Track # Import Instructor and Student from users app
from st_notifications.models import Note , PredefinedNotification
from st_notifications.serializers import NotificationSerializer, PredefinedNotificationSerializer, StudentSerializer
from rest_framework import generics, serializers  # DRF classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView


class SendNotificationView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'head', 'options']

    def post(self, request):
        """Allows instructors to send notes to students or tracks without authentication."""

        # Retrieve data from request
        instructor_id = request.data.get("instructor_id")
        student_id = request.data.get("student_id")
        track_id = request.data.get("track_id")
        message = request.data.get("message")

        # Ensure required fields are provided
        if not any([student_id, track_id]) or not all([instructor_id, message]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch instructor by ID
        instructor = get_object_or_404(Instructor, id=instructor_id)

        # Case: Send to all students in a track
        if track_id:
            track = get_object_or_404(Track, id=track_id)
            students_in_track = Student.objects.filter(track=track)

            notes = []
            for student in students_in_track:
                note = Note.objects.create(
                    instructor=instructor,
                    student=student,
                    track=track,
                    message=message
                )
                serialized_note = NotificationSerializer(note).data
                serialized_note["instructor_name"] = instructor.user.username
                serialized_note["instructor_id"] = instructor.id
                notes.append(serialized_note)

            return Response(
                {"message": f"Notes sent to all students in {track.name}!", "notes": notes},
                status=status.HTTP_201_CREATED
            )

        # Case: Send to individual student
        else:
            student = get_object_or_404(Student, id=student_id)
            note = Note.objects.create(
                instructor=instructor,
                student=student,
                message=message
            )
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
        notification = get_object_or_404(
            Note, id=pk, student__user=request.user)
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


class TrackNotificationListView(APIView):
    def get(self, request, track_id):
        track = get_object_or_404(Track, id=track_id)
        notes = Note.objects.filter(track=track).order_by('-created_at')
        serializer = NotificationSerializer(notes, many=True)
        return Response(serializer.data)


class PredefinedNotificationListCreateView(generics.ListCreateAPIView):
    queryset = PredefinedNotification.objects.all()
    serializer_class = PredefinedNotificationSerializer


class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
