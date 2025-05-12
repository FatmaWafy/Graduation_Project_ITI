from django.urls import path, include

from api import views
from .views import  (
    ApproveInstructorAPIView, ChangeInstructorPasswordAPIView, CourseListCreateView, CourseRetrieveUpdateDestroyView, 
    BranchListCreateView, BranchRetrieveUpdateDestroyView, InstructorProfileView, PendingInstructorsAPIView,
    RegisterInstructorAPIView,
    LoginAPIView,
    RegisterStudentAPIView, RejectInstructorAPIView,
    ResetPasswordRequestAPIView,
    ResetPasswordAPIView,
    StudentViewSet,
    TrackListAPIView,
    RegisterStudentsFromExcelAPIView,
    UploadUserProfileImage,
    ChangePasswordAPIView,
    InstructorViewSet ,
    InstructorTrackListAPIView,
    GoogleLoginAPIView,
    UpdateAdminProfile,
    CurrentAdminView,  # Added missing import
)
from rest_framework.routers import DefaultRouter
 
router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'instructors', InstructorViewSet)

urlpatterns = [
    path("register/", RegisterInstructorAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path('google/login/', GoogleLoginAPIView.as_view(), name='google_login'),  # نقطة نهاية لـ Google
    path('google/callback/', include('social_django.urls', namespace='social')),  # مسار Callback
    path("reset-password-request/", ResetPasswordRequestAPIView.as_view(), name="reset-password-request"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path('students/<int:user_id>/', StudentViewSet.as_view({'get': 'retrieve'})),
    path("register-student/", RegisterStudentAPIView.as_view(), name="register-student"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path('upload-profile-image/<int:user_id>/', UploadUserProfileImage.as_view(), name='upload_user_profile_image'),
    path("get-tracks/", TrackListAPIView.as_view(), name="get-tracks"),
    path("register-students-excel/", RegisterStudentsFromExcelAPIView.as_view(), name="register-students-excel"),
    
    # مسار الـ GET للحصول على بيانات الطالب
    path('students/<int:user_id>/', StudentViewSet.as_view({'get': 'retrieve'}), name='student-retrieve'),
    
    # مسار الـ PATCH لتحديث بيانات الطالب
    path('students/<int:user_id>/update/', StudentViewSet.as_view({'patch': 'update'}), name='student-update'),
    path('students/delete-by-student-id/<int:student_id>/', StudentViewSet.as_view({'delete': 'delete_by_student_id'}), name='student-delete-by-id'),     # مسار الـ GET للحصول على الـ external stats للطالب
    path('students/<int:user_id>/external-stats/', StudentViewSet.as_view({'get': 'external_stats'}), name='student-external-stats'),
    path('instructor/<int:instructor_id>/tracks/', InstructorTrackListAPIView.as_view(), name='instructor-tracks'),

    path('instructors/<int:user_id>/', InstructorViewSet.as_view({'get': 'retrieve'}), name='instructor-detail'),
    path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>/', BranchRetrieveUpdateDestroyView.as_view(), name='branch-retrieve-update-destroy'),

    # Course URLs
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-retrieve-update-destroy'),
    path('instructors/<int:user_id>/', InstructorProfileView.as_view(), name='instructor-profile'),
    path('instructors/<int:user_id>/update/', InstructorProfileView.as_view(), name='instructor-profile-update'),
    path('instructors/<int:user_id>/', InstructorProfileView.as_view(), name='instructor-profile'),
    path('instructors/<int:user_id>/update/', InstructorProfileView.as_view(), name='instructor-profile-update'),
    path('instructor/change-password/', ChangeInstructorPasswordAPIView.as_view(), name='change-instructor-password'),

    path('instructors/pending/', PendingInstructorsAPIView.as_view(), name='pending-instructors'),
    path('instructors/approve/<int:user_id>/', ApproveInstructorAPIView.as_view(), name='approve-instructor'),
    path('instructors/reject/<int:user_id>/', RejectInstructorAPIView.as_view(), name='reject-instructor'),
    path("current-admin/", CurrentAdminView.as_view(), name="current-admin"),
    path('update-admin-profile/<int:user_id>/', UpdateAdminProfile.as_view(), name='update-profile'),


    path('', include(router.urls)),

]