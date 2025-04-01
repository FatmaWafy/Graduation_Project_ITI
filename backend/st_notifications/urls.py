from django.urls import path
from .views import SendNotificationView,PredefinedNotificationListCreateView,StudentNotificationListView,StudentListCreateView ,MarkNotificationAsReadView, MarkAllNotificationsAsReadView

urlpatterns = [
    path('notes/', StudentNotificationListView.as_view(), name='notes-list-create'),
    path("notes/<int:pk>/", MarkNotificationAsReadView.as_view(), name="mark-notification-as-read"),
    path("mark-all-read/", MarkAllNotificationsAsReadView.as_view(), name="mark-all-notifications-as-read"),
    path('send-note/', SendNotificationView.as_view(), name='send-note'),
    path('students/', StudentListCreateView.as_view(), name='students-list-create'),
    path('predefined/', PredefinedNotificationListCreateView.as_view(), name='predefined-notifications'),
]
