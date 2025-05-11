from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Student, Instructor, Track

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("email", "username", "role", "is_staff", "is_superuser")
    list_filter = ("role", "is_staff", "is_superuser")
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Personal Info", {"fields": ("role", "signup_token")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role", "is_staff", "is_superuser"),
        }),
    )
    search_fields = ("email", "username")
    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions")

# 🔹 تخصيص عرض الـ Student Model في Django Admin
class StudentAdmin(admin.ModelAdmin):
    list_display = ("user", "track", "university", "graduation_year")
    list_filter = ("university", "graduation_year", "track")
    search_fields = ("user__username", "user__email", "university", "track__name")

class InstructorAdmin(admin.ModelAdmin):
    list_display = ("user", "experience_years")
    search_fields = ("user__username", "user__email")
    


class TrackAdmin(admin.ModelAdmin):
    list_display = ("name", "get_instructor", "get_students_count")
    search_fields = ("name", "instructor__user__username")

    def get_instructor(self, obj):
        return obj.instructor.user.username if obj.instructor else "No Instructor"
    get_instructor.short_description = "Instructor"

    def get_students_count(self, obj):
        return obj.students.count()  # ✅ استخدمي related_name الصحيح
    get_students_count.short_description = "Students Count"

admin.site.register(User, CustomUserAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Instructor, InstructorAdmin)
admin.site.register(Track, TrackAdmin)
