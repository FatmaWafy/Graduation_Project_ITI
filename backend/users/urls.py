from django.urls import path
from .views import RegisterInstructorAPIView, LoginAPIView, RegisterStudentAPIView , ResetPasswordRequestAPIView, ResetPasswordAPIView

urlpatterns = [
    path("register/", RegisterInstructorAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("reset-password-request/", ResetPasswordRequestAPIView.as_view(), name="reset-password-request"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("register-student/", RegisterStudentAPIView.as_view(), name="register-student"),

]
