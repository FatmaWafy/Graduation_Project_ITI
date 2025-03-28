from django.urls import path,include
from .views import (
    ExamListCreateView, ExamDetailView, TempExamViewSet,MCQQuestionViewSet, StudentExamAnswerViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"mcq-questions", MCQQuestionViewSet, basename="mcq-question")
# router.register(r"coding-questions", CodingQuestionViewSet, basename="coding-question")
router.register(r'temp-exams', TempExamViewSet)
urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('get-student-answer/<int:exam_instance_id>/', StudentExamAnswerViewSet.as_view({'get': 'get_student_answer'}), name='get-student-answer'),
    path("", include(router.urls)),  # Auto-generates CRUD URLs

]
