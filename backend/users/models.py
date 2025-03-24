from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

import secrets
class Instructor(AbstractUser):
    role = models.CharField(max_length=10, default='instructor')
    email = models.EmailField(unique=True)
    signup_token = models.CharField(max_length=32, blank=True, null=True, unique=True)  # 🔹 توكن الدعوة

    groups = models.ManyToManyField(
        Group,
        related_name="instructor_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="instructor_permissions",
        blank=True
    )

    def generate_signup_token(self):
      
        self.signup_token = secrets.token_urlsafe(16)
        self.save()

    class Meta:
        verbose_name = "Instructor"
        verbose_name_plural = "Instructors"

class Student(AbstractUser):
    university = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)
    college = models.CharField(max_length=100, blank=True, null=True)
    leetcode_profile = models.URLField(blank=True, null=True)
    github_profile = models.URLField(blank=True, null=True)
    role = models.CharField(max_length=10, default='student')
    email = models.EmailField(unique=True)


    groups = models.ManyToManyField(
        Group,
        related_name="student_groups",  # تعديل الاسم لمنع التعارض
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="student_permissions",  # تعديل الاسم لمنع التعارض
        blank=True
    )

    class Meta:
        verbose_name = "Student"
        verbose_name_plural = "Students"