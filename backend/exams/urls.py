from django.urls import path,include
from .views import (
    ExamListCreateView, ExamDetailView, MCQQuestion, CodingQuestion
    StudentExamSubmitView, StudentExamResultsView
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"mcq-questions", MCQQuestionViewSet, basename="mcq-question")
router.register(r"coding-questions", CodingQuestionViewSet, basename="coding-question")
urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('exams/<int:pk>/submit/', StudentExamSubmitView.as_view(), name='exam-submit'),
    path('students/<int:student_id>/results/', StudentExamResultsView.as_view(), name='student-results'),
    path("", include(router.urls)),  # Auto-generates CRUD URLs

]
