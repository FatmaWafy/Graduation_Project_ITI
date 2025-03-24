from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Instructor, Student

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class InstructorSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()

    class Meta:
        model = Instructor
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user_data["role"] = "instructor"  
        user = User.objects.create_user(**user_data)
        return Instructor.objects.create(user=user, **validated_data)

class StudentSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()

    class Meta:
        model = Student
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user_data["role"] = "student"
        user = User.objects.create_user(**user_data)
        return Student.objects.create(user=user, **validated_data)
