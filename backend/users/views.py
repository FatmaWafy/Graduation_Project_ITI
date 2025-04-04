from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import Instructor, Student, User ,Track
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegisterSerializer, InstructorSerializer, StudentSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets



token_generator = PasswordResetTokenGenerator()


class RegisterInstructorAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data["role"] = "instructor"

        if User.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = InstructorSerializer(data={"user": data, "track_name": data.get("track_name")})
        if serializer.is_valid():
            instructor = serializer.save()
            refresh = RefreshToken.for_user(instructor.user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # إنشاء التوكين باستخدام SimpleJWT
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role
        }, status=status.HTTP_200_OK)


class ResetPasswordRequestAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        email_subject = "Password Reset Request"
        email_message = f"""
        Hi {user.username},

        We received a request to reset your password for your account.

        Click the link below to reset your password:
        {reset_url}

        If you didn't request this, please ignore this email.

        Best,
        Your Website Team
        """

        send_mail(
            subject=email_subject,
            message=email_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not all([uidb64, token, new_password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid or expired link"}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters long"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)

class RegisterStudentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "instructor":
            return Response({"error": "Only instructors can add students."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data["role"] = "student"
        password = get_random_string(length=12)
        data["password"] = password  

        instructor = Instructor.objects.get(user=request.user)

        # التحقق من وجود Tracks للمدرب
        if instructor.tracks.count() == 0:
            return Response({"error": "Instructor has no assigned tracks."}, status=status.HTTP_400_BAD_REQUEST)

        if instructor.tracks.count() > 1:
            if "track_name" not in data:
                return Response({"error": "You must specify a track for the student."}, status=status.HTTP_400_BAD_REQUEST)
            
            track = instructor.tracks.filter(name=data["track_name"]).first()
            if not track:
                return Response({"error": "Invalid track selection."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            track = instructor.tracks.first()

        if not track:
            return Response({"error": "No valid track found for this instructor."}, status=status.HTTP_400_BAD_REQUEST)

        data["track_name"] = track.name  

        serializer = StudentSerializer(data={"user": data, "track_name": data["track_name"]})

        if serializer.is_valid():
            student = serializer.save()

            email_subject = "Your Student Account Credentials"
            email_message = f"""
            Hi {student.user.username},

            Your student account has been created successfully.

            Track: {student.track.name}
            Email: {student.user.email}
            Password: {password}

            Please change your password after logging in.

            Best regards,
            Your Team
            """

            send_mail(
                subject=email_subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[student.user.email],
                fail_silently=False,
            )

            refresh = RefreshToken.for_user(student.user)
            return Response({
                "message": "Student registered successfully. Login credentials sent via email.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class StudentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Students
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Create a new student
        """
        # نسخ البيانات القادمة من الـ request
        data = request.data.copy()

        # تعيين الدور "student" في البيانات
        data["role"] = "student"
        
        # تحقق من وجود track_name
        track_name = data.get("track_name")
        if not track_name:
            return Response({"error": "Track name is required."}, status=status.HTTP_400_BAD_REQUEST)

        # تحقق من وجود التراك
        track = Track.objects.filter(name=track_name).first()
        if not track:
            return Response({"error": "No track found with this name."}, status=status.HTTP_400_BAD_REQUEST)

        # إنشاء الـ serializer
        serializer = self.get_serializer(data={"user": data, **data})

        # التحقق من صحة البيانات
        if serializer.is_valid():
            # حفظ الطالب
            student = serializer.save()
            return Response({"message": "Student created successfully!", "student": serializer.data}, status=status.HTTP_201_CREATED)
        
        # إذا كانت البيانات غير صحيحة، أرجع الأخطاء
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, *args, **kwargs):
        """
        Update an existing student
        """
        instance = self.get_object()
        data = request.data.copy()

        # التحقق من وجود track وتحديثه إذا لزم الأمر
        if 'track' in data:  # هنا نستخدم track كـ ID
            track_id = data.get('track')
            try:
                track = Track.objects.get(id=track_id)  # نبحث عن track باستخدام ID
                instance.track = track  # نعيّن الكائن نفسه
            except Track.DoesNotExist:
                return Response({"error": "No track found with this ID."}, status=status.HTTP_400_BAD_REQUEST)

        # تحديث بيانات المستخدم
        if 'user' in data:
            user_data = data.pop('user')
            instance.user.username = user_data.get('username', instance.user.username)
            instance.user.email = user_data.get('email', instance.user.email)
            instance.user.save()

        # تحديث باقي الحقول
        for attr, value in data.items():
            setattr(instance, attr, value)

        instance.save()
        return Response({"message": "Student updated successfully!", "student": self.get_serializer(instance).data}, status=status.HTTP_200_OK)

class TrackListAPIView(APIView):
    """
    API endpoint to get all available tracks.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        tracks = Track.objects.all().values('id', 'name')  # Get both id and name
        return Response((tracks), status=status.HTTP_200_OK)
