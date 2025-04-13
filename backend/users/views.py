from rest_framework.decorators import action
from .serializers import UserProfileImageSerializer
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
import  string
import os
from rest_framework import generics 




token_generator = PasswordResetTokenGenerator()


class RegisterInstructorAPIView(APIView):
    
    permission_classes = [AllowAny]

    # قائمة البرانشات المعتمدة
    valid_branches = [
        "Smart Village", "New Capital", "Cairo University", "Alexandria", "Assiut", 
        "Aswan", "Beni Suef", "Fayoum", "Ismailia", "Mansoura", "Menofia", "Minya", 
        "Qena", "Sohag", "Tanta", "Zagazig", "New Valley", "Damanhour", "Al Arish", 
        "Banha", "Port Said", "Cairo Branch"
    ]

    def post(self, request):
        data = request.data.copy()
        data["role"] = "instructor"

        if User.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        if "branch" not in data:
            return Response({"error": "Branch is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if data["branch"] not in self.valid_branches:
            return Response({"error": f"The branch '{data['branch']}' is not valid. Please select a valid branch from the list."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = InstructorSerializer(
            data={"user": data, "track_name": data.get("track_name"), "branch": data["branch"]})

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

def get_leetcode_solved_problems(leetcode_username):

    if '/u/' in leetcode_username:
        leetcode_username = leetcode_username.split('/u/')[-1]

    elif leetcode_username.startswith('https://leetcode.com/u/'):
        leetcode_username = leetcode_username.split('/u/')[-1]

    # التحقق إذا كانت قيمة الـ username صحيحة
    if not leetcode_username or len(leetcode_username) < 3:
        print("Invalid username, please check the username format.")
        return None

    print(f"Fetching data for LeetCode username: {leetcode_username}")

    url = f"https://leetcode-stats-api.herokuapp.com/{leetcode_username}"
    response = requests.get(url)

    if response.status_code == 200:
        leetcode_data = response.json()
        # print(f"LeetCode API Response: {leetcode_data}")
        leetcode_solved = leetcode_data.get("totalSolved")

        return leetcode_solved
    else:
        print(f"Error fetching LeetCode stats: {response.status_code}")
        return None

class RegisterStudentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "instructor":
            return Response({"error": "Only instructors can add students."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        password = get_random_string(length=12)

        # التأكد من وجود حقل user في الـ data
        if "user" not in data:
            data["user"] = {}

        # إضافة الـ password داخل user
        data["user"]["password"] = password
        data["user"]["role"] = "student"  # التأكد من إضافة الـ role داخل user

        try:
            instructor = Instructor.objects.get(user=request.user)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found."}, status=status.HTTP_404_NOT_FOUND)

        # أخد الـ branch من الـ instructor
        if not instructor.branch:
            return Response({"error": "Instructor has no assigned branch."}, status=status.HTTP_400_BAD_REQUEST)

        # إذا لم يتم إرسال branch في الطلب، نستخدم branch الـ instructor
        if "branch" not in data:
            data["branch"] = instructor.branch.id

        serializer = StudentSerializer(data=data)

        if serializer.is_valid():
            student = serializer.save()

            try:
                email_subject = "Your Student Account Credentials"
                email_message = f"""
                Hi {student.user.username},

                Your student account has been created successfully.

                Track: {student.track.name if student.track else 'No Track Assigned'}
                Branch: {student.branch.name if student.branch else 'No Branch Assigned'}
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
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send email: {str(e)}")

            try:
                refresh = RefreshToken.for_user(student.user)
                return Response({
                    "message": "Student registered successfully. Login credentials sent via email.",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Failed to generate token: {str(e)}")
                return Response({
                    "message": "Student registered successfully, but token generation failed.",
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
    def external_stats(self, request, user_id=None):
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
            leetcode_username = student.leetcode_profile.strip(
                "/").split("/")[-1]
            leetcode_solved = get_leetcode_solved_problems(leetcode_username)

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
            leetcode_solved = get_leetcode_solved_problems(leetcode_username)

        return Response({
            "github_repos": github_repos,
            "leetcode_solved": leetcode_solved
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
            csv_reader = csv.reader(file_data)
            header = next(csv_reader, None)  # اقرأ الرأس
            print("CSV Header:", header)  # طباعة الرأس
            print("CSV Rows:", [row for row in csv_reader])  # طباعة الصفوف
            csv_reader = csv.reader(file_data)  # إعادة القراءة من البداية
            next(csv_reader)  # تخطي الرأس
        except Exception as e:
            print(f"Error reading CSV: {str(e)}")
            return Response({"error": f"Failed to read CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instructor = Instructor.objects.get(user=request.user)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found."}, status=status.HTTP_404_NOT_FOUND)

        if instructor.tracks.count() == 0:
            return Response({"error": "Instructor has no assigned tracks."}, status=status.HTTP_400_BAD_REQUEST)

        track_names = [track.name for track in instructor.tracks.all()]
        print("Available Track Names:", track_names)  # طباعة الـ tracks

        students_added = 0
        for row in csv_reader:
            print("Processing Row:", row)  # طباعة كل صف
            if len(row) < 3:
                print("Skipping row: Insufficient columns")
                continue

            username, email, track_name = row[0], row[1], row[2]
            print(f"Username: {username}, Email: {email}, Track: {track_name}")

            if track_name not in track_names:
                print(f"Skipping row: Track '{track_name}' not found")
                continue

            password = ''.join(
                choice(string.ascii_letters + string.digits) for i in range(12))

            try:
                user_instance = User.objects.create_user(
                    email=email,
                    username=username,
                    password=password,
                    role='student'
                )
            except Exception as e:
                print(f"Error creating user: {str(e)}")
                continue

            try:
                track = Track.objects.get(name=track_name)
                student = Student.objects.create(
                    user=user_instance,
                    track=track
                )
            except Exception as e:
                print(f"Error creating student: {str(e)}")
                user_instance.delete()
                continue

            try:
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
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Error sending email: {str(e)}")

            students_added += 1

        print(f"Total Students Added: {students_added}")
        return Response({
            "message": f"{students_added} students added successfully.",
        }, status=status.HTTP_201_CREATED)

class UploadUserProfileImage(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        try:
            # First try to find the student by ID
            student = get_object_or_404(Student, id=user_id)
            user = student.user
        except:
            # If not found, try to find the user directly
            user = get_object_or_404(User, id=user_id)
        
        # Check if there's a file in the request
        if 'profile_image' not in request.FILES:
            return Response({"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Log the received file for debugging
        image_file = request.FILES['profile_image']
        print(f"Received file: {image_file.name}, size: {image_file.size}, content type: {image_file.content_type}")
        
        # If user already has a profile image, delete the old one
        if user.profile_image and os.path.isfile(os.path.join(settings.MEDIA_ROOT, str(user.profile_image))):
            try:
                os.remove(os.path.join(settings.MEDIA_ROOT, str(user.profile_image)))
                print(f"Deleted old profile image: {user.profile_image}")
            except Exception as e:
                print(f"Error deleting old profile image: {e}")
        
        # Update the user's profile image
        serializer = UserProfileImageSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user_instance = serializer.save()
            
            # Construct the full URL for the profile image
            if user_instance.profile_image:
                # Get the base URL from the request
                host = request.get_host()
                protocol = 'https' if request.is_secure() else 'http'
                base_url = f"{protocol}://{host}"
                
                # Construct the full image URL
                image_url = f"{base_url}{settings.MEDIA_URL}{user_instance.profile_image.name}"
                
                return Response({
                    "message": "Profile image uploaded successfully",
                    "profile_image": image_url
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Profile image could not be saved",
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
