from django.urls import path, include
from .views import (
    ExamListCreateView, ExamDetailView, TempExamViewSet, MCQQuestionViewSet, StudentExamAnswerViewSet ,CreateExamView
)
from rest_framework.routers import DefaultRouter

# إنشاء الراوتر وتسجيل الـ ViewSets
router = DefaultRouter()
router.register(r"mcq-questions", MCQQuestionViewSet, basename="mcq-question")
router.register(r'temp-exams', TempExamViewSet)
router.register(r'student-exam-answers', StudentExamAnswerViewSet, basename="student-exam-answer")  # ✅ إصلاح التسجيل

urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path("", include(router.urls)), 
     path("create-exam/", CreateExamView.as_view(), name="create-exam"),
]
