from django.contrib import admin
from .models import User, Student, Instructor

class InstructorAdmin(admin.ModelAdmin):
    list_display = ("get_username", "get_email", "experience_years")

    def get_username(self, obj):
        return obj.user.username  # احصل على اسم المستخدم من الحقل المرتبط
    get_username.short_description = "Username"

    def get_email(self, obj):
        return obj.user.email  # احصل على البريد الإلكتروني من الحقل المرتبط
    get_email.short_description = "Email"

class StudentAdmin(admin.ModelAdmin):
    list_display = ("get_username", "get_email", "university", "graduation_year")

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Username"

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"

admin.site.register(User)
admin.site.register(Instructor, InstructorAdmin)
admin.site.register(Student, StudentAdmin)
