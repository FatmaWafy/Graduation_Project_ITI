from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Instructor
from .serializers import RegisterSerializer, InstructorSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny

User = get_user_model()
class RegisterInstructorAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data["role"] = "instructor"  # إجبار الدور أن يكون "instructor"

        # التحقق من وجود البريد الإلكتروني مسبقًا
        if User.objects.filter(email=data['email']).exists():
            return Response({"error": "Email is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            # لا حاجة لإنشاء Instructor منفصل بعد الآن لأن Instructor هو المستخدم مباشرة
            user = serializer.save()  # إنشاء المستخدم
            # هنا لا تحتاج إلى Instructor.objects.create، لأن المستخدم هو نفسه المدرب
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)

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

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "role": user.role}, status=status.HTTP_200_OK)
