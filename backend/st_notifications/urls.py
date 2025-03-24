from django.urls import path
from .views import NotificationListCreateView , StudentListCreateView, PredefinedNotificationListCreateView

urlpatterns = [
    path('notes/', NotificationListCreateView.as_view(), name='notes-list-create'),
    path('students/', StudentListCreateView.as_view(), name='students-list-create'),
    path('predefined/', PredefinedNotificationListCreateView.as_view(), name='predefined-notifications'),
]