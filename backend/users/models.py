from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models
import secrets

# 🔹 User Manager 
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True or extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_staff=True and is_superuser=True.")
        return self.create_user(email, username, password, **extra_fields)

# 🔹 Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Admin'),
        ('user', 'User'),
        # ('superuser', 'Superuser'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    email = models.EmailField(unique=True)
    signup_token = models.CharField(max_length=32, blank=True, null=True, unique=True)  
    profile_image = models.URLField(max_length=500, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True) 

    groups = models.ManyToManyField(
        Group,
        related_name="user_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="user_permissions",
        blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def generate_signup_token(self):
        self.signup_token = secrets.token_urlsafe(16)
        self.save()

# 🔹 Instructor Model
class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="instructor", null=True, blank=True)
    experience_years = models.PositiveIntegerField(blank=True, null=True)
    branch = models.ForeignKey("Branch", on_delete=models.SET_NULL, null=True, blank=True, related_name="instructors")  # 🔹 الربط بالفرع
    # role = models.CharField(max_length=10, choices=User.ROLE_CHOICES, default='instructor')  # 🔹 إضافة دور المدرب
    class Meta:
        verbose_name = "Instructor"
        verbose_name_plural = "Instructors"

    def __str__(self):
        return f"Instructor: {self.user.username}"

# 🔹 Track Model (بعد التعديل)
class Track(models.Model):
    name = models.CharField(max_length=255)  # اسم التراك
    instructors = models.ManyToManyField("Instructor", related_name="tracks", blank=True)

    class Meta:
        verbose_name = "Track"
        verbose_name_plural = "Tracks"

    def __str__(self):
        return self.name

class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Branch"
        verbose_name_plural = "Branches"

    def __str__(self):
        return self.name


class Course(models.Model):
    name = models.CharField(max_length=255)
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="courses")
    instructor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, related_name="courses")

    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"

    def __str__(self):
        return f"{self.name} ({self.track.name})"
    
# 🔹 Student Model (مع إضافة التراك)
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    track = models.ForeignKey(Track, on_delete=models.SET_NULL, null=True, blank=True, related_name="students")  
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name="students") 
    inrollment_date = models.DateField(blank=True, null=True)

    university = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)
    college = models.CharField(max_length=100, blank=True, null=True)
    leetcode_profile = models.CharField(max_length=255, blank=True, null=True)

    github_profile = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = "Student"
        verbose_name_plural = "Students"

    def __str__(self):
        return f"Student: {self.user.username} - Track: {self.track.name if self.track else 'No Track'}"


