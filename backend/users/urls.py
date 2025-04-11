from django.urls import path, include
from .views import  (
    CourseListCreateView, CourseRetrieveUpdateDestroyView, 
    BranchListCreateView, BranchRetrieveUpdateDestroyView,
    RegisterInstructorAPIView,
    LoginAPIView,
    RegisterStudentAPIView,
    ResetPasswordRequestAPIView,
    ResetPasswordAPIView,
    StudentViewSet,
    TrackListAPIView,
    RegisterStudentsFromExcelAPIView,
    ChangePasswordAPIView
    ,InstructorViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path("register/", RegisterInstructorAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("reset-password-request/", ResetPasswordRequestAPIView.as_view(), name="reset-password-request"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path('students/<int:user_id>/', StudentViewSet.as_view({'get': 'retrieve'})),
    path("register-student/", RegisterStudentAPIView.as_view(), name="register-student"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),

    path("get-tracks/", TrackListAPIView.as_view(), name="get-tracks"),
    path("register-students-excel/", RegisterStudentsFromExcelAPIView.as_view(), name="register-students-excel"),
    
    # مسار الـ GET للحصول على بيانات الطالب
    path('students/<int:user_id>/', StudentViewSet.as_view({'get': 'retrieve'}), name='student-retrieve'),
    
    # مسار الـ PATCH لتحديث بيانات الطالب
    path('students/<int:user_id>/update/', StudentViewSet.as_view({'patch': 'update'}), name='student-update'),
    
    # مسار الـ GET للحصول على الـ external stats للطالب
    path('students/<int:user_id>/external-stats/', StudentViewSet.as_view({'get': 'external_stats'}), name='student-external-stats'),
    
    path('instructors/<int:user_id>/', InstructorViewSet.as_view({'get': 'retrieve'}), name='instructor-detail'),
    path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>/', BranchRetrieveUpdateDestroyView.as_view(), name='branch-retrieve-update-destroy'),

    # Course URLs
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-retrieve-update-destroy'),

    path('', include(router.urls)),
]