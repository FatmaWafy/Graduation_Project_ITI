# from rest_framework.permissions import AllowAny
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404
# from users.models import Instructor, Student , Track # Import Instructor and Student from users app
# from st_notifications.models import Note , PredefinedNotification
# from st_notifications.serializers import NotificationSerializer, PredefinedNotificationSerializer, StudentSerializer
# from rest_framework import generics, serializers  # DRF classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.generics import ListAPIView

# class SendNotificationView(APIView):
#     permission_classes = [AllowAny]
#     http_method_names = ['get', 'post', 'head', 'options']

#     def post(self, request):
#         """Allows instructors to send notes to students or tracks without authentication."""

#         # Retrieve data from request
#         instructor_id = request.data.get("instructor_id")
#         student_id = request.data.get("student_id")
#         track_id = request.data.get("track_id")
#         message = request.data.get("message")

#         # Ensure required fields are provided
#         if not any([student_id, track_id]) or not all([instructor_id, message]):
#             return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

#         # Fetch instructor by ID
#         instructor = get_object_or_404(Instructor, id=instructor_id)

#         # Case: Send to all students in a track
#         if track_id:
#             track = get_object_or_404(Track, id=track_id)

#             # ✅ Check if this track is actually linked to the instructor
#             if instructor not in track.instructors.all():
#                 return Response({"error": "This instructor is not assigned to the selected track."},
#                                 status=status.HTTP_403_FORBIDDEN)

#             students_in_track = Student.objects.filter(track=track)

#             notes = []
#             for student in students_in_track:
#                 note = Note.objects.create(
#                     instructor=instructor,
#                     student=student,
#                     track=track,
#                     message=message
#                 )
#                 serialized_note = NotificationSerializer(note).data
#                 serialized_note["instructor_name"] = instructor.user.username
#                 serialized_note["instructor_id"] = instructor.id
#                 notes.append(serialized_note)
                
#                 # إرسال Push Notification
#                 send_push_notification(request, note.id)

#             return Response(
#                 {"message": f"Notes sent to all students in {track.name}!", "notes": notes},
#                 status=status.HTTP_201_CREATED
#             )

#         # Case: Send to individual student
#         else:
#             student = get_object_or_404(Student, id=student_id)
#             note = Note.objects.create(
#                 instructor=instructor,
#                 student=student,
#                 message=message
#             )
#             response_data = NotificationSerializer(note).data
#             response_data["instructor_name"] = instructor.user.username
#             response_data["instructor_id"] = instructor.id

#             # إرسال Push Notification
#             send_push_notification(request, note.id)

#             return Response(
#                 {"message": "Note sent successfully!", "note": response_data},
#                 status=status.HTTP_201_CREATED
#             )

# class MarkNotificationAsReadView(APIView):
#     permission_classes = [IsAuthenticated]

#     def patch(self, request, pk):
#         notification = get_object_or_404(
#             Note, id=pk, student__user=request.user)
#         notification.read = True
#         notification.save()
#         return Response({"message": "Notification marked as read."}, status=status.HTTP_200_OK)

# class MarkAllNotificationsAsReadView(APIView):
#     permission_classes = [IsAuthenticated]

#     def patch(self, request):
#         student = get_object_or_404(Student, user=request.user)
#         Note.objects.filter(student=student, read=False).update(read=True)
#         return Response({"message": "All notifications marked as read."}, status=status.HTTP_200_OK)

# class StudentNotificationListView(ListAPIView):
#     """List all notifications for the logged-in student."""
#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         student = Student.objects.get(user=self.request.user)
#         print(student)
#         return Note.objects.filter(student_id=student.id).order_by("-created_at")

# class TrackNotificationListView(APIView):
#     def get(self, request, track_id):
#         track = get_object_or_404(Track, id=track_id)
#         notes = Note.objects.filter(track=track).order_by('-created_at')
#         serializer = NotificationSerializer(notes, many=True)
#         return Response(serializer.data)

# class PredefinedNotificationListCreateView(generics.ListCreateAPIView):
#     queryset = PredefinedNotification.objects.all()
#     serializer_class = PredefinedNotificationSerializer

# class StudentListCreateView(generics.ListCreateAPIView):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer


from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.models import Instructor, Student, Track
from st_notifications.models import Note, PredefinedNotification, PushSubscription
from st_notifications.serializers import NotificationSerializer, PredefinedNotificationSerializer, StudentSerializer
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from pywebpush import webpush
import os
from pyfcm import FCMNotification

class SendNotificationView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'head', 'options']

    def post(self, request):
        """Allows instructors to send notes to students or tracks without authentication."""
        instructor_id = request.data.get("instructor_id")
        student_id = request.data.get("student_id")
        track_id = request.data.get("track_id")
        message = request.data.get("message")

        if not any([student_id, track_id]) or not all([instructor_id, message]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        instructor = get_object_or_404(Instructor, id=instructor_id)

        if track_id:
            track = get_object_or_404(Track, id=track_id)
            if instructor not in track.instructors.all():
                return Response({"error": "This instructor is not assigned to the selected track."},
                                status=status.HTTP_403_FORBIDDEN)

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

                # استبدال استدعاء الدالة باستخدام الكلاس
                try:
                    send_push_view = SendPushNotificationView()
                    send_push_view.post(request, note_id=note.id)
                except Exception as e:
                    print(f"Failed to send push notification: {e}")

            return Response(
                {"message": f"Notes sent to all students in {track.name}!", "notes": notes},
                status=status.HTTP_201_CREATED
            )
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

            # استبدال استدعاء الدالة باستخدام الكلاس
            try:
                send_push_view = SendPushNotificationView()
                send_push_view.post(request, note_id=note.id)
            except Exception as e:
                print(f"Failed to send push notification: {e}")

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

class SubscribeView(APIView):
    permission_classes = [IsAuthenticated]
    http_method_names = ['post', 'options']

    def post(self, request):
        try:
            user = request.user
            print(f"User authenticated: {user.is_authenticated}, User: {user}")

            if not user:
                return Response(
                    {"status": "error", "message": "User must be authenticated to subscribe"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            subscription_data = json.loads(request.body)
            token = subscription_data.get('token')

            # حذف الاشتراكات القديمة للمستخدم
            PushSubscription.objects.filter(user=user).delete()

            # إنشاء اشتراك جديد
            PushSubscription.objects.create(user=user, token=token)
            return Response(
                {"status": "success", "message": "Subscription saved"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Error in SubscribeView: {str(e)}")
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# class SendPushNotificationView(APIView):
#     permission_classes = [AllowAny]
#     http_method_names = ['post', 'options']

#     def post(self, request, note_id):
#         try:
#             note = get_object_or_404(Note, id=note_id)
#             student = note.student
#             if not student or not student.user:
#                 return Response(
#                     {"error": "No student or user associated with this note"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             subscriptions = PushSubscription.objects.filter(user=student.user)
#             if not subscriptions.exists():
#                 return Response(
#                     {"error": "No subscription found for this student"},
#                     status=status.HTTP_404_NOT_FOUND
#                 )

#             payload = {
#                 "title": f"Notification from {note.instructor.user.username}",
#                 "body": note.message,
#                 "id": str(note.id),
#             }

#             print(f"Sending push notification to {subscriptions.count()} subscriptions")

#             for subscription in subscriptions:
#                 print(f"Sending to subscription: {subscription.subscription}")
#                 webpush(
#                     subscription_info=subscription.subscription,
#                     data=json.dumps(payload),
#                     vapid_private_key=os.getenv("VAPID_PRIVATE_KEY"),
#                     vapid_claims={"sub": f"mailto:{os.getenv('VAPID_EMAIL')}"}
#                 )
#                 print("Push notification sent successfully")

#             return Response(
#                 {"status": "success", "message": "Push notification sent"},
#                 status=status.HTTP_200_OK
#             )
#         except Exception as e:
#             print(f"Error in SendPushNotificationView: {str(e)}")
#             return Response(
#                 {"status": "error", "message": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )




class SendPushNotificationView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['post', 'options']

    def post(self, request, note_id):
        try:
            note = get_object_or_404(Note, id=note_id)
            student = note.student
            if not student or not student.user:
                return Response(
                    {"error": "No student or user associated with this note"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            subscriptions = PushSubscription.objects.filter(user=student.user)
            if not subscriptions.exists():
                return Response(
                    {"error": "No subscription found for this student"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # إعداد FCM
            push_service = FCMNotification(api_key=os.getenv("FCM_SERVER_KEY"))

            # جمع التوكنز من الاشتراكات
            registration_ids = [subscription.subscription['token'] for subscription in subscriptions]

            # إعداد البيانات
            message_title = f"Notification from {note.instructor.user.username}"
            message_body = note.message
            data_message = {
                "id": str(note.id),
            }

            print(f"Sending push notification to {len(registration_ids)} devices")

            # إرسال الإشعار
            result = push_service.notify_multiple_devices(
                registration_ids=registration_ids,
                message_title=message_title,
                message_body=message_body,
                data_message=data_message
            )

            print(f"FCM result: {result}")

            if result['success'] > 0:
                print("Push notification sent successfully")
                return Response(
                    {"status": "success", "message": "Push notification sent"},
                    status=status.HTTP_200_OK
                )
            else:
                print("Failed to send push notification")
                return Response(
                    {"status": "error", "message": "Failed to send push notification"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            print(f"Error in SendPushNotificationView: {str(e)}")
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )