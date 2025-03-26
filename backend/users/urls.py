from django.urls import path,include
from .views import RegisterInstructorAPIView, LoginAPIView, RegisterStudentAPIView , ResetPasswordRequestAPIView, ResetPasswordAPIView,StudentViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path("register/", RegisterInstructorAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("reset-password-request/", ResetPasswordRequestAPIView.as_view(), name="reset-password-request"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("register-student/", RegisterStudentAPIView.as_view(), name="register-student"),
    path('', include(router.urls)),


]
