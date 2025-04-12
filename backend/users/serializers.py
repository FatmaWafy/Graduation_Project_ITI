from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Branch, Course, Instructor, Student , Track
from PIL import Image
from django.core.exceptions import ValidationError
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)  # 🔹 استخدام set_password() لضمان تشفير كلمة المرور
        user.save()
        return user

class InstructorSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()
    track_name = serializers.CharField(write_only=True, required=True)
    branch = serializers.CharField(write_only=True, required=True)  # إضافة حقل البرانش

    class Meta:
        model = Instructor
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        track_name = validated_data.pop("track_name")
        branch_name = validated_data.pop("branch")

        user_data["role"] = "instructor"
        user = User.objects.create_user(**user_data)

        track, created = Track.objects.get_or_create(name=track_name)

        branch, created = Branch.objects.get_or_create(name=branch_name)

        instructor = Instructor.objects.create(user=user, branch=branch, **validated_data)
        
        track.instructor = instructor
        track.save()

        return instructor



# class StudentSerializer(serializers.ModelSerializer):
#     user = RegisterSerializer()
#     track = serializers.SlugRelatedField(queryset=Track.objects.all(), slug_field='name')


#     class Meta:
#         model = Student
#         fields = "__all__"
#         extra_kwargs = {
#             "branch": {"read_only": True},  # نمنع التعديل عليه من اليوزر
#         }

#     def create(self, validated_data):
#         user_data = validated_data.pop("user")
#         track_name = validated_data.pop("track")

#         # البحث عن التراك
#         track = Track.objects.get(name=track_name)
#         instructor = track.instructor
#         if instructor and instructor.branch:
#             branch = instructor.branch
#         else:
#             raise serializers.ValidationError("This track has no instructor with a branch assigned.")

#         user_data["role"] = "student"
#         user = User.objects.create_user(**user_data)

#         student = Student.objects.create(user=user, track=track, **validated_data)

#         return student


from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Branch, Course, Instructor, Student, Track

User = get_user_model()

class StudentSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()
    track = serializers.SlugRelatedField(queryset=Track.objects.all(), slug_field='name')

    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {
            "branch": {"read_only": True},  # نمنع التعديل عليه من اليوزر
        }

    def create(self, validated_data):
        try:
            # استخراج البيانات
            user_data = validated_data.pop("user", None)
            track_name = validated_data.pop("track", None)

            # التحقق من وجود user_data و track_name
            if not user_data:
                raise serializers.ValidationError("User data is required.")
            if not track_name:
                raise serializers.ValidationError("Track name is required.")

            # البحث عن التراك
            try:
                track = Track.objects.get(name=track_name)
            except Track.DoesNotExist:
                raise serializers.ValidationError(f"Track with name '{track_name}' does not exist.")

            # التحقق من وجود instructor و branch
            instructor = track.instructor
            if not instructor or not instructor.branch:
                raise serializers.ValidationError(
                    "This track has no instructor with a branch assigned."
                )
            branch = instructor.branch

            # إضافة الـ role إلى user_data
            user_data["role"] = "student"

            # إنشاء المستخدم
            try:
                user = User.objects.create_user(**user_data)
            except Exception as e:
                raise serializers.ValidationError(f"Failed to create user: {str(e)}")

            # إنشاء الطالب
            try:
                student = Student.objects.create(
                    user=user,
                    track=track,
                    branch=branch,
                    **validated_data
                )
            except Exception as e:
                # حذف المستخدم إذا فشل إنشاء الطالب لتجنب بيانات غير متسقة
                user.delete()
                raise serializers.ValidationError(f"Failed to create student: {str(e)}")

            return student

        except serializers.ValidationError as ve:
            raise ve
        except Exception as e:
            # تسجيل الخطأ لتسهيل التصحيح
            print(f"Error in StudentSerializer.create: {str(e)}")
            raise serializers.ValidationError(f"An unexpected error occurred: {str(e)}")

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


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