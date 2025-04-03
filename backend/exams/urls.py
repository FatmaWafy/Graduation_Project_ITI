from django.urls import path, include

from .views import (
    ExamListCreateView, ExamDetailView, TempExamViewSet, MCQQuestionViewSet, 
    StudentExamAnswerViewSet, CreateExamView, ExamQuestionsView ,FilteredMCQQuestionListView,GetTempExamByTrack,GetTempExamByStudent)
from rest_framework.routers import DefaultRouter

# إنشاء الراوتر وتسجيل الـ ViewSets
router = DefaultRouter()
router.register(r"mcq-questions", MCQQuestionViewSet, basename="mcq-question")
router.register(r'temp-exams', TempExamViewSet)
# router.register(r'student-exam-answers', StudentExamAnswerViewSet, basename="student-exam-answer")

urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('submit-exam-answer/', StudentExamAnswerViewSet.as_view({'post': 'submit_exam_answer'}), name='submit-exam-answer'),
    path('get-student-answer/<int:exam_instance_id>/', StudentExamAnswerViewSet.as_view({'get': 'get_student_answer'}), name='get-student-answer'),
    path('questions/', FilteredMCQQuestionListView.as_view(), name='filtered-questions'),
    # This endpoint will allow queries like /questions/?difficulty=easy
    path('temp-exams-by-track/<int:track_id>/', GetTempExamByTrack.as_view(), name='temp_exam_by_track'),
    path('temp-exams-by-student/<int:student_id>/', GetTempExamByStudent.as_view(), name='temp_exam_by_student'),
    path("", include(router.urls)),  # Auto-generates CRUD URLs

]
