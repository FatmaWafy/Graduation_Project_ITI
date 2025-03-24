from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.core.mail import send_mail
from django.conf import settings
from .models import Student, Instructor
import secrets

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Additional Info', {'fields': ('phone', 'role')}),
    )

class InstructorAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

    def save_model(self, request, obj, form, change):
   
        if not change: 
            obj.generate_signup_token()  
            signup_url = f"http://localhost:3000/signup"  

            email_subject = "Instructor Registration Invitation"
            email_message = f"""
            Hello {obj.username},

            You have been invited to register as an instructor.
            Click the link below to complete your registration:
            {signup_url}

            If you did not request this, please ignore this email.

            Regards,
            Admin Team
            """

            send_mail(
                subject=email_subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[obj.email],
                fail_silently=False,
            )

        super().save_model(request, obj, form, change)


class StudentAdmin(admin.ModelAdmin):
    list_display = ['username', 'university', 'graduation_year', 'college', 'leetcode_profile', 'github_profile']

admin.site.register(Instructor, InstructorAdmin)
admin.site.register(Student, StudentAdmin)
