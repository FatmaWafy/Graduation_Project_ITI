from django.urls import path
from .views import SendNotificationView,PredefinedNotificationListCreateView,StudentNotificationListView,StudentListCreateView

urlpatterns = [
    path('notes/', StudentNotificationListView.as_view(), name='notes-list-create'),
    path('send-note/', SendNotificationView.as_view(), name='send-note'),
    path('students/', StudentListCreateView.as_view(), name='students-list-create'),
    path('predefined/', PredefinedNotificationListCreateView.as_view(), name='predefined-notifications'),
]
