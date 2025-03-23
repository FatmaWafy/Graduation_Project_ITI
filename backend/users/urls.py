from django.urls import path
from .views import RegisterInstructorAPIView, LoginAPIView

urlpatterns = [
    path("register/", RegisterInstructorAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
]
