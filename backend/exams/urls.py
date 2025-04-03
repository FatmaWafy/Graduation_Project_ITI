from django.urls import path, include

from .views import (
    ExamListCreateView, ExamDetailView, TempExamViewSet, MCQQuestionViewSet, 
    StudentExamAnswerViewSet, CreateExamView, ExamQuestionsView  # Add ExamQuestionsView
)
from rest_framework.routers import DefaultRouter

# إنشاء الراوتر وتسجيل الـ ViewSets
router = DefaultRouter()
router.register(r"mcq-questions", MCQQuestionViewSet, basename="mcq-question")
router.register(r'temp-exams', TempExamViewSet)
# router.register(r'student-exam-answers', StudentExamAnswerViewSet, basename="student-exam-answer")

urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('exams/<int:exam_id>/questions/', ExamQuestionsView.as_view(), name='exam-questions'),  # Add this path
    
    path('exams/submit-exam-answer/', StudentExamAnswerViewSet.as_view({'post': 'submit_exam_answer'}), name='submit-exam-answer'),
    path("", include(router.urls)),
    path("create-exam/", CreateExamView.as_view(), name="create-exam"),
]
