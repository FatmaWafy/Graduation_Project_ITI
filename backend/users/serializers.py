from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Branch, Course, Instructor, Student , Track
from PIL import Image # type: ignore
from django.core.exceptions import ValidationError
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role", "profile_image", "phone_number", "address"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class InstructorSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()
    track_name = serializers.CharField(write_only=True, required=True)
    branch = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Instructor
        fields = "__all__"

    def validate_track_name(self, value):
        value = value.strip()  # Remove extra spaces
        if not Track.objects.filter(name=value).exists():
            raise serializers.ValidationError(f"Track with name '{value}' does not exist.")
        return value

    def create(self, validated_data):
        try:
            user_data = validated_data.pop("user")
            track_name = validated_data.pop("track_name")
            branch_name = validated_data.pop("branch")

            print(f"Received track_name: {track_name}")  # Debug

            user_data["role"] = "instructor"
            user = User.objects.create_user(**user_data)

            branch, _ = Branch.objects.get_or_create(name=branch_name)
            instructor = Instructor.objects.create(user=user, branch=branch, **validated_data)

            track = Track.objects.get(name=track_name)  # Use get instead of get_or_create
            track.instructors.add(instructor)

            print(f"Instructor {instructor.user.username} linked to track: {track_name}")  # Debug

            return instructor

        except Exception as e:
            print(f"Error in InstructorSerializer.create: {str(e)}")
            raise serializers.ValidationError(f"Failed to create instructor: {str(e)}")
class StudentSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()
    track = serializers.PrimaryKeyRelatedField(queryset=Track.objects.all(), required=False, allow_null=True)
    track_name = serializers.CharField(write_only=True, required=False)  # حقل إضافي لاستقبال track_name
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Student
        fields = "__all__"

    def create(self, validated_data):
        try:
            user_data = validated_data.pop("user", None)
            track_name = validated_data.pop("track_name", None)
            track = validated_data.pop("track", None)
            branch = validated_data.pop("branch", None)

            if not user_data:
                raise serializers.ValidationError("User data is required.")

            # إذا تم إرسال track_name بدلاً من track، نحولها إلى track
            if track_name and not track:
                try:
                    track = Track.objects.get(name=track_name)
                except Track.DoesNotExist:
                    raise serializers.ValidationError(f"Track with name '{track_name}' does not exist.")

            user_data["role"] = "student"
            user = User.objects.create_user(**user_data)

            student = Student.objects.create(
                user=user,
                track=track,
                branch=branch,
                **validated_data
            )

            return student

        except serializers.ValidationError as ve:
            raise ve
        except Exception as e:
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
    
class TrackSerializer(serializers.ModelSerializer):
    instructors = InstructorSerializer(many=True)  

    class Meta:
        model = Track
        fields = "__all__"
