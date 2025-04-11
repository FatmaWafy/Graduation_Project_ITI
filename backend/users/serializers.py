from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Branch, Course, Instructor, Student, Track
from PIL import Image
from django.core.exceptions import ValidationError

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role", "profile_image"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        # 🔹 استخدام set_password() لضمان تشفير كلمة المرور
        user.set_password(password)
        user.save()
        return user


class InstructorSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()
    # 🔹 التأكد من أن track_name مطلوب
    track_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Instructor
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        track_name = validated_data.pop("track_name")

        # تعيين دور المستخدم كمدرب
        user_data["role"] = "instructor"
        user = User.objects.create_user(**user_data)

        # البحث عن التراك أو إنشاؤه
        track, created = Track.objects.get_or_create(name=track_name)

        instructor = Instructor.objects.create(user=user, **validated_data)
        track.instructor = instructor
        track.save()

        return instructor


class StudentSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()
    track = serializers.PrimaryKeyRelatedField(
        queryset=Track.objects.all())  # هنا هنخليها تستقبل الـ ID مباشرة

    class Meta:
        model = Student
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        track = validated_data.pop("track")

        user_data["role"] = "student"
        user = User.objects.create_user(**user_data)

        student = Student.objects.create(
            user=user, track=track, **validated_data)

        return student


class UserProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # نموذج المستخدم الأساسي
        fields = ['profile_image']  # الحقل اللي هنشتغل عليه

    def validate_profile_image(self, value):
        if value:
            # التحقق من أن الملف صورة صالحة
            try:
                img = Image.open(value)  # فتح الملف باستخدام Pillow
                img.verify()  # التحقق من أن الملف صورة صالحة
                value.seek(0)  # إعادة المؤشر للبداية بعد التحقق
            except Exception:
                raise serializers.ValidationError(
                    "The uploaded file is not a valid image.")

            # التحقق من حجم الملف (الحد الأقصى 2 ميجابايت)
            if value.size > 2 * 1024 * 1024:  # 2MB = 2 * 1024 * 1024 بايت
                raise serializers.ValidationError(
                    "The uploaded file is too large. Maximum size is 2MB.")

            # يمكنك إضافة تحققات إضافية مثل نوع الملف
            valid_formats = ['image/jpeg', 'image/png', 'image/gif']
            if value.content_type not in valid_formats:
                raise serializers.ValidationError(
                    "Only JPEG, PNG, and GIF images are supported.")

        return value
class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"
