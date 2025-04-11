from django.urls import path,include
from .views import BranchListCreateView, BranchRetrieveUpdateDestroyView, CourseListCreateView, CourseRetrieveUpdateDestroyView, RegisterInstructorAPIView, LoginAPIView, RegisterStudentAPIView , ResetPasswordRequestAPIView, ResetPasswordAPIView,StudentViewSet,TrackListAPIView
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path("register/", RegisterInstructorAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("reset-password-request/", ResetPasswordRequestAPIView.as_view(), name="reset-password-request"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("register-student/", RegisterStudentAPIView.as_view(), name="register-student"),
    path("get-tracks/", TrackListAPIView.as_view(), name="get-tracks"),
    path('branches/', BranchListCreateView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>/', BranchRetrieveUpdateDestroyView.as_view(), name='branch-retrieve-update-destroy'),

    # Course URLs
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-retrieve-update-destroy'),

    path('', include(router.urls)),


]
