from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.core.mail import send_mail
from django.conf import settings
from .models import User, Student, Instructor

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Additional Info', {'fields': ('role',)}),  # 🔹 حذف "phone" لأنه غير موجود
    )

class InstructorAdmin(admin.ModelAdmin):
    list_display = ['get_username', 'get_email', 'experience_years']  # 🔹 جلب البيانات من `user`

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Username"

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"

    def save_model(self, request, obj, form, change):
        if not change:
            obj.user.generate_signup_token()  # 🔹 إنشاء توكن الدعوة من `User`
            signup_url = f"http://localhost:3000/signup"  # 🔹 تضمين التوكن

            email_subject = "Instructor Registration Invitation"
            email_message = f"""
            Hello {obj.user.username},

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
                recipient_list=[obj.user.email],
                fail_silently=False,
            )

        super().save_model(request, obj, form, change)

class StudentAdmin(admin.ModelAdmin):
    list_display = ("get_username", "get_email", "university", "graduation_year")

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Username"

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"

admin.site.register(User, CustomUserAdmin)  # 🔹 تسجيل `User` مع التعديلات الجديدة
admin.site.register(Instructor, InstructorAdmin)
admin.site.register(Student, StudentAdmin)
