from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from .models import Instructor

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return User.objects.create(**validated_data)

class InstructorSerializer(serializers.ModelSerializer):
    user = RegisterSerializer()

    class Meta:
        model = Instructor
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user_data["role"] = "instructor"  # تأكيد أن الدور Instructor
        user = User.objects.create(**user_data)
        instructor = Instructor.objects.create(user=user, **validated_data)
        return instructor
