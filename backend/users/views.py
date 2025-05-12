from rest_framework.decorators import action
from .serializers import TrackSerializer, UserProfileImageSerializer
from .models import Student, Instructor
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import Branch, Course, Instructor, Student, User, Track
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import BranchSerializer, CourseSerializer, RegisterSerializer, InstructorSerializer, StudentSerializer
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
from django.db.models import Q
import  string
import os
from datetime import date
from rest_framework import generics 
from datetime import datetime, timezone
from social_django.utils import psa
from social_django.utils import load_strategy, load_backend
from django.contrib.auth import get_user_model

token_generator = PasswordResetTokenGenerator()
User = get_user_model()

class RegisterInstructorAPIView(APIView):
    permission_classes = [AllowAny]

    valid_branches = [
        "Smart Village", "New Capital", "Cairo University", "Alexandria", "Assiut", 
        "Aswan", "Beni Suef", "Fayoum", "Ismailia", "Mansoura", "Menofia", "Minya", 
        "Qena", "Sohag", "Tanta", "Zagazig", "New Valley", "Damanhour", "Al Arish", 
        "Banha", "Port Said", "Cairo Branch"
    ]

    def post(self, request):
        data = request.data.copy()
        data["role"] = "instructor"

        print(f"Request data: {data}")

        # Check if the email is already used
        if User.objects.filter(email=data["email"]).exists():
            print("Email already in use")
            return Response({"error": "Email is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if branch is provided and valid
        if "branch" not in data:
            print("Branch is missing")
            return Response({"error": "Branch is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if data["branch"] not in self.valid_branches:
            print(f"Invalid branch: {data['branch']}")
            return Response({"error": f"The branch '{data['branch']}' is not valid. Please select a valid branch from the list."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize the serializer
        serializer = InstructorSerializer(
            data={"user": data, "track_name": data.get("track_name"), "branch": data["branch"]}
        )

        print("Checking serializer validity...")
        if serializer.is_valid():
            print("Serializer is valid")
            instructor = serializer.save()
            print(f"Instructor created: {instructor}, Email: {instructor.user.email}")

            # Send welcome email
            email_subject = "Welcome to the Platform"
            email_message = f"""
Hi {instructor.user.username},

You have been registered as an instructor.

Please complete your profile and start using the platform by visiting the following link:
http://localhost:3000/signup

Best regards,
Your Admin Team
"""
            try:
                print(f"Sending email to {instructor.user.email}...")
                send_mail(
                    subject=email_subject,
                    message=email_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[instructor.user.email],
                    fail_silently=False,
                )
                print("Email sent successfully")
            except Exception as e:
                print(f"Failed to send email: {str(e)}")
                # يمكنك اختيار متابعة التنفيذ أو إرجاع خطأ
                # return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(instructor.user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)

        print(f"Serializer errors: {serializer.errors}")
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

        # إذا كان للمدرب أكتر من تراك، يجب تحديد التراك
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
        data["branch"] = instructor.branch.name  # ربط الطالب بالبرانش الخاص بالإنستراكتور

        serializer = StudentSerializer(
            data={
                "user": data,
                "track": data["track_name"],
                "branch": data["branch"],  # التعديل هنا لربط البرانش بالطالب
            }
        )

        if serializer.is_valid():
            student = serializer.save()

            email_subject = "Your Student Account Credentials"
            email_message = f"""
            Hi {student.user.username},

            Your student account has been created successfully.

            Track: {student.track.name}
            Branch: {student.branch.name}
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
    

def get_leetcode_stats_and_recent(leetcode_username, days=3):
    # إزالة أي رابط زائد
    leetcode_username = leetcode_username.strip("/").split("/")[-1]

    # 1. عدد المسائل المحلولة من API الخارجي
    total_solved = None
    stats_url = f"https://leetcode-stats-api.herokuapp.com/{leetcode_username}"
    stats_response = requests.get(stats_url)
    if stats_response.status_code == 200:
        stats_data = stats_response.json()
        total_solved = stats_data.get("totalSolved")

    # 2. آخر السبميشنز (من LeetCode GraphQL)
    recent_submissions = []
    graphql_url = "https://leetcode.com/graphql"
    query = """
    query recentSubmissions($username: String!) {
        recentSubmissionList(username: $username, limit: 20) {
            title
            status
            timestamp
        }
    }
    """
    variables = {"username": leetcode_username}
    
    # Adding headers for the request
    headers = {
        "Content-Type": "application/json",
        "Referer": f"https://leetcode.com/{leetcode_username}/",
        "User-Agent": "Mozilla/5.0"
    }

    graphql_response = requests.post(graphql_url, json={"query": query, "variables": variables}, headers=headers)
    
    if graphql_response.status_code == 200:
        data = graphql_response.json()
        submissions = data.get("data", {}).get("recentSubmissionList", [])
        now = datetime.now(timezone.utc)

        for sub in submissions:
            sub_time = datetime.fromtimestamp(int(sub["timestamp"]), tz=timezone.utc)
            # print("Submission time:", sub_time)

            # Add submission to the list
            recent_submissions.append({
                "title": sub["title"],
                "status": sub["status"],
                "timestamp": sub_time.strftime("%Y-%m-%d %H:%M:%S")
            })

        # Debug output for response and timestamps
        # print(f"now: {now}, sub_time: {sub_time}")
    else:
        print("Error with GraphQL request:", graphql_response.text)

    return {
        "total_solved": total_solved,
        "recent_submissions": recent_submissions
    }


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
            user = User.objects.get(id=user_id)
            student = Student.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({"error": "Student not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        # دمج البيانات من جدول الـ User و Student
        # استخدام RegisterSerializer بدلاً من UserSerializer
        user_data = RegisterSerializer(user).data
        student_data = StudentSerializer(student).data
        combined_data = {**user_data, **student_data}

        return Response(combined_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Create a new student
        """
        data = request.data.copy()
        data["role"] = "student"

        track_name = data.get("track_name")
        if not track_name:
            return Response({"error": "Track name is required."}, status=status.HTTP_400_BAD_REQUEST)

        track = Track.objects.filter(name=track_name).first()
        if not track:
            return Response({"error": "No track found with this name."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={"user": data, **data})

        if serializer.is_valid():
            student = serializer.save()
            return Response({"message": "Student created successfully!", "student": serializer.data}, status=status.HTTP_201_CREATED)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing student
        """
        user_id = kwargs.get('user_id')


        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            student = Student.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({"error": "Student not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        # التحقق من وجود track وتحديثه إذا لزم الأمر
        if 'track' in data:
            track_id = data.get('track')
            try:
                track = Track.objects.get(id=track_id)
                student.track = track
            except Track.DoesNotExist:
                return Response({"error": "No track found with this ID."}, status=status.HTTP_400_BAD_REQUEST)

        if 'user' in data:
            user_data = data.pop('user')
            student.user.username = user_data.get(
                'username', student.user.username)
            student.user.email = user_data.get('email', student.user.email)
            student.user.phone_number = user_data.get('phone_number', student.user.phone_number)
            student.user.address = user_data.get('address', student.user.address)
            student.user.save()

        for attr, value in data.items():
            setattr(student, attr, value)

        student.save()
        return Response({"message": "Student updated successfully!", "student": self.get_serializer(student).data}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
            """
            Delete a specific student based on user ID
            """
            user_id = kwargs.get('user_id')

            try:
                user = User.objects.get(id=user_id)
                student = Student.objects.get(user=user)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            except Student.DoesNotExist:
                return Response({"error": "Student not found for this user."}, status=status.HTTP_404_NOT_FOUND)

            student.delete()
            return Response({"message": "Student deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'], url_path='external-stats')
    def external_stats(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")
        
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            student = Student.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({"error": "Student not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        github_repos = None
        leetcode_solved = None

        # -------- GitHub --------
        if student.github_profile:
            github_username = student.github_profile.strip("/").split("/")[-1]
            github_url = f"https://api.github.com/users/{github_username}"
            github_response = requests.get(github_url)
            if github_response.status_code == 200:
                github_data = github_response.json()
                github_repos = github_data.get("public_repos")

        # -------- LeetCode --------
        if student.leetcode_profile:
            leetcode_username = student.leetcode_profile.strip("/").split("/")[-1]
            leetcode_solved = get_leetcode_stats_and_recent(leetcode_username)

        return Response({
            "github_repos": github_repos,
            "leetcode_solved": leetcode_solved
        })

    @action(detail=False, methods=['get'], url_path='external-stats/by-student-id/(?P<student_id>[^/.]+)')
    def external_stats_by_student_id(self, request, student_id=None):
        if not student_id:
            return Response({"error": "Student ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        github_repos = None
        leetcode_solved = None
        leetcode_recent = []

        # -------- GitHub --------
        if student.github_profile:
            github_username = student.github_profile.strip("/").split("/")[-1]
            github_url = f"https://api.github.com/users/{github_username}"
            github_response = requests.get(github_url)
            if github_response.status_code == 200:
                github_data = github_response.json()
                github_repos = github_data.get("public_repos")

        # -------- LeetCode --------
        if student.leetcode_profile:
            leetcode_username = student.leetcode_profile.strip("/").split("/")[-1]
            leetcode_data = get_leetcode_stats_and_recent(leetcode_username, days=3)

            leetcode_solved = leetcode_data["total_solved"]
            leetcode_recent = leetcode_data["recent_submissions"]

        return Response({
            "github_repos": github_repos,
            "leetcode_solved": leetcode_solved,
            "leetcode_recent_submissions": leetcode_recent
        })



    @action(detail=False, methods=['get'], url_path='by-id/(?P<student_id>[^/.]+)')
    def get_by_student_id(self, request, student_id=None):
        """
        Retrieve a student using the student ID (not the user ID)
        """
        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        user_data = RegisterSerializer(student.user).data
        student_data = StudentSerializer(student).data

        combined_data = {**user_data, **student_data}
        return Response(combined_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='delete-by-student-id/(?P<student_id>[^/.]+)')
    def delete_by_student_id(self, request, student_id=None):
        """
        Delete a specific student based on the student ID
        """
        if not student_id:
            return Response({"error": "Student ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        student.delete()
        return Response({"message": "Student deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)

class TrackListAPIView(APIView):
    """
    API endpoint to get all available tracks.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        tracks = Track.objects.all().values('id', 'name')  # Get both id and name
        return Response((tracks), status=status.HTTP_200_OK)

# class RegisterStudentsFromExcelAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         if request.user.role != "instructor":
#             return Response({"error": "Only instructors can add students."}, status=status.HTTP_403_FORBIDDEN)

#         if 'file' not in request.FILES:
#             return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

#         file = request.FILES['file']

#         try:
#             file_data = file.read().decode("utf-8").splitlines()
#             csv_reader = csv.reader(file_data)
#             next(csv_reader)  # Skip header
#         except Exception as e:
#             return Response({"error": f"Failed to read CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

#         instructor = Instructor.objects.get(user=request.user)

#         if instructor.tracks.count() == 0:
#             return Response({"error": "Instructor has no assigned tracks."}, status=status.HTTP_400_BAD_REQUEST)

#         track_names = [track.name for track in instructor.tracks.all()]
#         branch = instructor.branch

#         students_added = 0
#         for row in csv_reader:
#             if len(row) < 8:
#                 continue

#             username, email, track_name = row[0], row[1], row[2]
#             university = row[3]
#             graduation_year = int(row[4]) if row[4].isdigit() else None
#             college = row[5]
#             leetcode_profile = row[6]
#             github_profile = row[7]

#             if track_name not in track_names:
#                 continue

#             password = ''.join(choice(string.ascii_letters + string.digits) for _ in range(12))

#             user_instance = User.objects.create_user(
#                 email=email,
#                 username=username,
#                 password=password,
#                 role='student'
#             )

#             track = Track.objects.get(name=track_name)

#             student = Student.objects.create(
#                 user=user_instance,
#                 track=track,
#                 branch=branch,
#                 university=university,
#                 graduation_year=graduation_year,
#                 college=college,
#                 leetcode_profile=leetcode_profile,
#                 github_profile=github_profile,
#                 inrollment_date=date.today(),
#             )

#     # إرسال البريد الإلكتروني (زي ما هو)


#             email_subject = "Your Student Account Credentials"
#             email_message = f"""
#             Hi {student.user.username},

#             Your student account has been created successfully.

#             Track: {student.track.name}
#             Email: {student.user.email}
#             Password: {password}

#             Please change your password after logging in.

#             Best regards,
#             Your Team
#             """

#             send_mail(
#                 subject=email_subject,
#                 message=email_message,
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 recipient_list=[student.user.email],
#                 fail_silently=False,
#             )

#             students_added += 1

#         return Response({
#             "message": f"{students_added} students added successfully.",
#         }, status=status.HTTP_201_CREATED)




class RegisterStudentsFromExcelAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "instructor":
            return Response({"error": "Only instructors can add students."}, status=status.HTTP_403_FORBIDDEN)

        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']

        try:
            file_data = file.read().decode("utf-8").splitlines()
            csv_reader = csv.reader(file_data, delimiter=',')
            header = next(csv_reader, None)  # Skip header
            if not header or len(header) < 8:
                return Response({"error": "Invalid CSV header."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to read CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        instructor = Instructor.objects.get(user=request.user)

        if instructor.tracks.count() == 0:
            return Response({"error": "Instructor has no assigned tracks."}, status=status.HTTP_400_BAD_REQUEST)

        track_names = [track.name.lower() for track in instructor.tracks.all()]
        branch = instructor.branch

        students_added = 0
        duplicates = []
        for row in csv_reader:
            if len(row) < 8:
                duplicates.append(f"Row {row} - Insufficient columns")
                continue

            username, email, track_name = row[0], row[1], row[2]
            university = row[3]
            graduation_year = int(row[4]) if row[4].isdigit() else 2024  # Default if invalid
            college = row[5]
            leetcode_profile = row[6]
            github_profile = row[7]

            if track_name.lower() not in track_names:
                duplicates.append(f"{username} ({email}) - Invalid track '{track_name}'")
                continue

            if User.objects.filter(Q(email=email) | Q(username=username)).exists():
                duplicates.append(f"{username} ({email}) - Already exists")
                continue

            password = ''.join(choice(string.ascii_letters + string.digits) for _ in range(12))

            try:
                user_instance = User.objects.create_user(
                    email=email,
                    username=username,
                    password=password,
                    role='student'
                )

                track = Track.objects.get(name__iexact=track_name)

                student = Student.objects.create(
                    user=user_instance,
                    track=track,
                    branch=branch,
                    university=university,
                    graduation_year=graduation_year,
                    college=college,
                    leetcode_profile=leetcode_profile,
                    github_profile=github_profile,
                    inrollment_date=date.today(),
                )

                # Send email
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

            except Exception as e:
                duplicates.append(f"{username} ({email}) - Failed to create: {str(e)}")
                continue

        response_data = {
            "message": f"{students_added} students added successfully.",
            "duplicates": duplicates if duplicates else []
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
class UploadUserProfileImage(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        try:
            # Try to find the student
            student = Student.objects.filter(id=user_id).first()
            if student:
                user = student.user
            else:
                # If not a student, try instructor
                instructor = Instructor.objects.filter(id=user_id).first()
                if instructor:
                    user = instructor.user
                else:
                    return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Check if there's a file in the request
        if 'profile_image' not in request.FILES:
            return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['profile_image']

        # Delete old image if exists
        if user.profile_image and os.path.isfile(os.path.join(settings.MEDIA_ROOT, str(user.profile_image))):
            try:
                os.remove(os.path.join(settings.MEDIA_ROOT, str(user.profile_image)))
                print(f"Deleted old profile image: {user.profile_image}")
            except Exception as e:
                print(f"Error deleting old profile image: {e}")

        # Update the profile image
        serializer = UserProfileImageSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user_instance = serializer.save()

            # Create image URL
            if user_instance.profile_image:
                host = request.get_host()
                protocol = 'https' if request.is_secure() else 'http'
                image_url = f"{protocol}://{host}{settings.MEDIA_URL}{user_instance.profile_image.name}"

                return Response({
                    "message": "Profile image uploaded successfully",
                    "profile_image": image_url
                }, status=status.HTTP_200_OK)

            return Response({"message": "Profile image could not be saved"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordAPIView(APIView):
    permission_classes = [AllowAny]  # هتحتاجي تغيري دا بعدين لما تضبطي التوكنات

    def post(self, request):
        student_id = request.data.get("student_id")
        current_password = request.data.get("currentPassword")
        new_password = request.data.get("newPassword")

        try:
            student = Student.objects.get(id=student_id)
            user = student.user

            if not user.check_password(current_password):
                return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

            if len(new_password) < 8:
                return Response({"error": "Password must be at least 8 characters long"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    @action(detail=False, methods=['get'])
    def instructor_data(self, request):
        """
        Get instructor's tracks and branches
        """
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated.'}, status=401)
        
        # Ensure that the user has an associated Instructor
        try:
            instructor = request.user.instructor
        except Instructor.DoesNotExist:
            return Response({'error': 'Instructor not found for this user.'}, status=404)

        # Get the tracks associated with the instructor
        tracks = instructor.tracks.all()

        # Get the branches related to the instructor through the branch relation
        branches = Branch.objects.filter(instructors=instructor).distinct()

        # Serialize the data
        track_data = TrackSerializer(tracks, many=True).data
        branch_data = BranchSerializer(branches, many=True).data
        

        return Response({
            'tracks': track_data,
            'branches': branch_data,
            "instructor_id": instructor.id,
        })

    @action(detail=False, methods=['get'])
    def instructor_students(self, request):
        """
        Get students belonging to instructor's tracks
        """
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated.'}, status=401)

        # Ensure that the user has an associated Instructor
        try:
            instructor = request.user.instructor
        except Instructor.DoesNotExist:
            return Response({'error': 'Instructor not found for this user.'}, status=404)

        # Get the tracks associated with the instructor
        tracks = instructor.tracks.all()
        if not tracks.exists():
            return Response({'error': 'No tracks found for this instructor.'}, status=404)
        # Get the students associated with the tracks                   
        
        students = Student.objects.filter(track__in=tracks)

        # Serialize the data
        student_data = []
        for student in students:
            student_data.append({
                'id': student.id,
                'user': {
                    'username': student.user.username,
                    'email': student.user.email,
                    'role': student.user.role
                },
                'track': {
                    'id': student.track.id if student.track else None,
                    'name': student.track.name if student.track else None
                },
                'branch': {
                    'id': student.branch.id if student.branch else None,
                    'name': student.branch.name if student.branch else None
                }
            })

        return Response(student_data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific instructor based on the user ID in the URL
        """
        user_id = kwargs.get('user_id')

        try:
            user = User.objects.get(id=user_id)
            instructor = Instructor.objects.get(user=user)
            
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        user_data = RegisterSerializer(user).data
        instructor_data = InstructorSerializer(instructor).data

        combined_data = {**user_data, **instructor_data}

        return Response(combined_data, status=status.HTTP_200_OK)
class BranchListCreateView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)
    def post(self, request,args, kwargs):
        # Check if it's a list of objects
        if isinstance(request.data, list):
            serializer = BranchSerializer(data=request.data, many=True)
        else:
            serializer = BranchSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, *args, kwargs):
        # Update branch based on the given ID (assuming it's passed in kwargs)
        branch = Branch.objects.get(id=kwargs.get('id'))
        serializer = BranchSerializer(branch, data=request.data, partial=True)  # partial=True allows partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BranchRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [AllowAny]

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
            data = request.data
            if isinstance(data, list):  # Check if the request body is a list of courses
                # Create multiple course instances at once
                serializer = self.get_serializer(data=data, many=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return super().create(request, *args, **kwargs)  # Handle single course creation

class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

class InstructorProfileView(APIView):
    """
    Retrieve and update instructor profile
    """
    def get(self, request, user_id, format=None):
        """
        Retrieve instructor profile
        """
        try:
            user = User.objects.get(id=user_id)
            instructor = Instructor.objects.get(user=user)
            serializer = InstructorSerializer(instructor)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found for this user."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, user_id, format=None):
        """
        Update an existing instructor
        """
        if not user_id:
            return Response({"error": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            instructor = Instructor.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        if 'user' in data:
            user_data = data.pop('user')
            user.username = user_data.get('username', user.username)
            user.email = user_data.get('email', user.email)
            user.phone_number = user_data.get('phone_number', user.phone_number)
            user.address = user_data.get('address', user.address)
            user.save()

        for attr, value in data.items():
            setattr(instructor, attr, value)

        instructor.save()
        return Response({
            "message": "Instructor updated successfully!", 
            "instructor": InstructorSerializer(instructor).data
        }, status=status.HTTP_200_OK)
class ChangeInstructorPasswordAPIView(APIView):
    permission_classes = [AllowAny]  # Change to IsAuthenticated later if needed

    def post(self, request):
        instructor_id = request.data.get("instructor_id")
        current_password = request.data.get("currentPassword")
        new_password = request.data.get("newPassword")

        try:
            instructor = Instructor.objects.get(id=instructor_id)
            user = instructor.user

            if not user.check_password(current_password):
                return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

            if len(new_password) < 8:
                return Response({"error": "Password must be at least 8 characters long"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
        
class InstructorTrackListAPIView(APIView):
    """
    API endpoint to get tracks for a specific instructor.
    """
    permission_classes = [AllowAny]

    def get(self, request, instructor_id):
        try:
            instructor = Instructor.objects.get(id=instructor_id)
            tracks = instructor.tracks.all().values('id', 'name')  # Get only related tracks
            return Response(tracks, status=status.HTTP_200_OK)
        except Instructor.DoesNotExist:
            return Response({'error': 'Instructor not found'}, status=status.HTTP_404_NOT_FOUND)
        
# class GoogleLoginAPIView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         try:
#             token = request.data.get('token')
#             track_name = request.data.get('track_name')
#             branch_name = request.data.get('branch_name')
#             is_signup = request.data.get('is_signup', False)

#             if not token:
#                 return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

#             # التحقق من التوكن يدويًا عبر Google API
#             print("Verifying token with Google API:", token)
#             response = requests.get(
#                 'https://www.googleapis.com/oauth2/v3/userinfo',
#                 headers={'Authorization': f'Bearer {token}'}
#             )

#             if response.status_code != 200:
#                 return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

#             user_data = response.json()
#             email = user_data.get('email')
#             if not email:
#                 return Response({"error": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

#             # التحقق من وجود المستخدم
#             if User.objects.filter(email=email).exists():
#                 existing_user = User.objects.get(email=email)
#                 refresh = RefreshToken.for_user(existing_user)
#                 return Response({
#                     "access": str(refresh.access_token),
#                     "refresh": str(refresh),
#                     "role": existing_user.role,
#                 }, status=status.HTTP_200_OK)

#             # إذا لم يكن المستخدم موجودًا
#             if is_signup:
#                 if not track_name or not branch_name:
#                     return Response({"error": "Track and branch are required for new instructors"}, status=status.HTTP_400_BAD_REQUEST)

#                 track = Track.objects.filter(name=track_name).first()
#                 branch = Branch.objects.filter(name=branch_name).first()
#                 if not track or not branch:
#                     return Response({"error": "Invalid track or branch"}, status=status.HTTP_400_BAD_REQUEST)

#                 user_data = {
#                     "username": email.split('@')[0],
#                     "email": email,
#                     "role": "instructor",
#                 }
#                 new_user = User.objects.create_user(**user_data)

#                 instructor = Instructor.objects.create(user=new_user, branch=branch)
#                 track.instructors.add(instructor)

#                 refresh = RefreshToken.for_user(new_user)
#                 return Response({
#                     "access": str(refresh.access_token),
#                     "refresh": str(refresh),
#                     "role": new_user.role,
#                 }, status=status.HTTP_201_CREATED)
#             else:
#                 return Response({"error": "User does not exist. Please sign up as an instructor."}, status=status.HTTP_400_BAD_REQUEST)

#         except Exception as e:
#             print("Exception occurred:", str(e))
#             return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            token = request.data.get('token')
            track_name = request.data.get('track_name')
            branch_name = request.data.get('branch_name')
            is_signup = request.data.get('is_signup', False)

            if not token:
                return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # التحقق من التوكن يدويًا عبر Google API
            print("Verifying token with Google API:", token)
            response = requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {token}'}
            )

            if response.status_code != 200:
                print("Google API response:", response.status_code, response.text)
                return Response({"error": "Invalid token", "details": response.text}, status=status.HTTP_400_BAD_REQUEST)

            user_data = response.json()
            email = user_data.get('email')
            if not email:
                return Response({"error": "Email not provided by Google"}, status=status.HTTP_400_BAD_REQUEST)

            # التحقق من وجود المستخدم
            if User.objects.filter(email=email).exists():
                existing_user = User.objects.get(email=email)
                refresh = RefreshToken.for_user(existing_user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "role": existing_user.role,
                }, status=status.HTTP_200_OK)

            # إذا لم يكن المستخدم موجودًا
            if is_signup:
                user_data = {
                    "username": email.split('@')[0],
                    "email": email,
                    "role": "instructor",
                }
                new_user = User.objects.create_user(**user_data)

                # إنشاء Instructor
                track = Track.objects.filter(name=track_name).first()
                branch = Branch.objects.filter(name=branch_name).first()
                if not track or not branch:
                    return Response({"error": "Invalid track or branch"}, status=status.HTTP_400_BAD_REQUEST)

                instructor = Instructor.objects.create(user=new_user, branch=branch)
                track.instructors.add(instructor)

                refresh = RefreshToken.for_user(new_user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "role": new_user.role,
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "User does not exist. Please sign up as an instructor."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Exception occurred:", str(e))
            return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
 
 # views.py
from django.core.mail import send_mail
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import tempfile
import os

@csrf_exempt
def send_instructor_invitations(request):
    if request.method == 'POST':
        csv_file = request.FILES.get('csv_file')
        
        if not csv_file:
            return JsonResponse({'status': 'error', 'message': 'No file uploaded'}, status=400)
        
        try:
            # Save the uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                for chunk in csv_file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            
            # Read the file
            if csv_file.name.endswith('.csv'):
                df = pd.read_csv(tmp_path)
            else:
                df = pd.read_excel(tmp_path)
            
            # Clean up
            os.unlink(tmp_path)
            
            # Check for email column
            if 'email' not in df.columns:
                return JsonResponse({'status': 'error', 'message': 'CSV must contain an "email" column'}, status=400)
            
            emails = df['email'].dropna().unique()
            success_count = 0
            
            # Send emails
            for email in emails:
                try:
                    send_mail(
                        'Instructor Signup Invitation',
                        f'Please signup here as an instructor in titi from this link: "https://link.com"',
                        'no-reply@example.com',  # From email
                        [email],  # To email
                        fail_silently=False,
                    )
                    success_count += 1
                except Exception as e:
                    print(f"Failed to send to {email}: {str(e)}")
            
            return JsonResponse({
                'status': 'success',
                'message': f'Successfully sent {success_count} out of {len(emails)} invitations'
            })
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

def instructor_invitation_page(request):
    return render(request, 'instructor_invitation.html')