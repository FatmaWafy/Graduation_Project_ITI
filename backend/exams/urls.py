from django.urls import path
from .views import (
    ExamListCreateView, ExamDetailView, QuestionListCreateView,
    StudentExamSubmitView, StudentExamResultsView
)

urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('exams/<int:pk>/questions/', QuestionListCreateView.as_view(), name='exam-questions'),
    path('exams/<int:pk>/submit/', StudentExamSubmitView.as_view(), name='exam-submit'),
    path('students/<int:student_id>/results/', StudentExamResultsView.as_view(), name='student-results'),
]
