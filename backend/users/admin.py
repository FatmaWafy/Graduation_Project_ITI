from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import  Student, Instructor

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
    list_display = ['username']

class StudentAdmin(admin.ModelAdmin):
    list_display = ['username', 'university', 'graduation_year', 'college', 'leetcode_profile', 'github_profile']

admin.site.register(Instructor, InstructorAdmin)
admin.site.register(Student, StudentAdmin)
