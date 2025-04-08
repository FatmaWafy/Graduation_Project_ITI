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
import pandas as pd
from openpyxl import load_workbook
import csv
from random import choice
import string

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
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific student based on the user ID in the URL
        """
        user_id = kwargs.get('user_id')  # جلب الـ user ID من الـ URL

        try:
            # البحث عن المستخدم باستخدام الـ user ID
            user = User.objects.get(id=user_id)
            # البحث عن الطالب المرتبط بالـ user
            student = Student.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({"error": "Student not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        # دمج البيانات من جدول الـ User و Student
        user_data = RegisterSerializer(user).data  # استخدام RegisterSerializer بدلاً من UserSerializer
        student_data = StudentSerializer(student).data

        # دمج البيانات
        combined_data = {**user_data, **student_data}

        return Response(combined_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Create a new student
        """
        data = request.data.copy()
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing student
        """
        instance = self.get_object()
        data = request.data.copy()

        # التحقق من وجود track وتحديثه إذا لزم الأمر
        if 'track' in data:
            track_id = data.get('track')
            try:
                track = Track.objects.get(id=track_id)
                instance.track = track
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
    
class InstructorViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Instructors
    """
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific instructor based on the user ID in the URL
        """
        user_id = kwargs.get('user_id')  # جلب الـ user ID من الـ URL

        try:
            user = User.objects.get(id=user_id)
            instructor = Instructor.objects.get(user=user)
            
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        user_data = RegisterSerializer(user).data  # استخدام RegisterSerializer بدلاً من UserSerializer
        instructor_data = InstructorSerializer(instructor).data

        combined_data = {**user_data, **instructor_data}

        return Response(combined_data, status=status.HTTP_200_OK)
    

class TrackListAPIView(APIView):
    """
    API endpoint to get all available tracks.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        tracks = Track.objects.all().values('id', 'name')  # Get both id and name
        return Response((tracks), status=status.HTTP_200_OK)


class RegisterStudentsFromExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # تأكد أن المستخدم هو المدرب
        if request.user.role != "instructor":
            return Response({"error": "Only instructors can add students."}, status=status.HTTP_403_FORBIDDEN)

        # التحقق من وجود ملف
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']

        # محاولة فتح وقراءة ملف CSV
        try:
            # استخدام مكتبة csv لقراءة البيانات من الملف
            file_data = file.read().decode("utf-8").splitlines()
            csv_reader = csv.reader(file_data)
            next(csv_reader)  # تخطي العنوان
        except Exception as e:
            return Response({"error": f"Failed to read CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        instructor = Instructor.objects.get(user=request.user)

        # التحقق من وجود Tracks للمدرب
        if instructor.tracks.count() == 0:
            return Response({"error": "Instructor has no assigned tracks."}, status=status.HTTP_400_BAD_REQUEST)

        # إذا كان المدرب لديه أكثر من تراك، نتأكد من التحديد الصحيح للتراك
        if instructor.tracks.count() > 1:
            track_names = [track.name for track in instructor.tracks.all()]
        else:
            track_names = [instructor.tracks.first().name]

        students_added = 0
        for row in csv_reader:  # قراءة البيانات من كل صف
            # تحقق من أن الصف يحتوي على 3 عناصر على الأقل (username, email, track_name)
            if len(row) < 3:
                continue  # تخطي الصف إذا كان لا يحتوي على البيانات الكافية

            username, email, track_name = row[0], row[1], row[2]

            # التحقق من أن التراك الموجود في الملف هو تراك موجود بالفعل
            if track_name not in track_names:
                continue  # تجاهل الصف إذا كان التراك غير موجود

            # توليد كلمة مرور عشوائية
            password = ''.join(choice(string.ascii_letters + string.digits) for i in range(12))

            # إنشاء حساب المستخدم الجديد
            user_instance = User.objects.create_user(
                email=email, 
                username=username,  # يمكن استخدام اسم المستخدم كما هو
                password=password,
                role='student'  # تعيين دور المستخدم كـ "student"
            )

            # إنشاء كائن التراك
            track = Track.objects.get(name=track_name)

            # إنشاء كائن الطالب وربطه بحساب المستخدم والتراك
            student = Student.objects.create(
                user=user_instance,  # ربط الطالب بحساب المستخدم الذي تم إنشاؤه
                track=track
            )

            # إرسال بريد إلكتروني للطالب يحتوي على بيانات الدخول
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

            students_added += 1

        return Response({
            "message": f"{students_added} students added successfully.",
        }, status=status.HTTP_201_CREATED)