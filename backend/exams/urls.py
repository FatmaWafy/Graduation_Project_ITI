from django.urls import path, include

from .views import (
    CheatingLogView, CodingQuestionViewSet, ExamListCreateView, ExamDetailView, StudentExamAnswerViewSet, TempExamViewSet, MCQQuestionViewSet ,FilteredMCQQuestionListView,GetTempExamByTrack,GetTempExamByStudent, CodingtestCaseViewSet,FilteredCodingQuestionListView, get_cheating_logs)
from rest_framework.routers import DefaultRouter

# إنشاء الراوتر وتسجيل الـ ViewSets
router = DefaultRouter()
router.register(r"mcq-questions", MCQQuestionViewSet, basename="mcq-question")
router.register(r'temp-exams', TempExamViewSet),
router.register(r'code-questions', CodingQuestionViewSet)
router.register(r'test-cases', CodingtestCaseViewSet)
router.register(r'exam-answers', StudentExamAnswerViewSet, basename='exam-answer')
router.register(r'student-exam-answers', StudentExamAnswerViewSet, basename="student-exam-answer")
urlpatterns = [
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'), 
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'),
    path('exam/temp-exams/<int:pk>/questions/', TempExamViewSet.as_view({'get': 'get_questions'}), name='temp-exam-questions'), # get questions for a specific temp exam
    # path('get-student-answer/<int:pk>/', StudentExamAnswerViewSet.as_view({'get': 'get_student_answer'}), name='get_student_answer'),
    path('get-student-answer/<int:exam_instance_id>/', StudentExamAnswerViewSet.as_view({'get': 'get_student_answer'}), name='get-student-answer'),   ## gets exam instance answers for all students
    path('mcq-filter/' , FilteredMCQQuestionListView.as_view(), name='filtered-questions'),
    path('coding-filter/' , FilteredCodingQuestionListView.as_view(), name='filtered-coding-questions'),
    # This endpoint will allow queries like /questions/?difficulty=easy
    path('temp-exams-by-track/<int:track_id>/', GetTempExamByTrack.as_view(), name='temp_exam_by_track'),
    path('temp-exams-by-student/<int:student_id>/', GetTempExamByStudent.as_view(), name='temp_exam_by_student'),
    path('temp-exams-by-student/<int:student_id>/', GetTempExamByStudent.as_view(), name='temp_exam_by_student'),
    path("exams/logs/", CheatingLogView.as_view()),
    path('exams/logs/<int:exam_id>/', get_cheating_logs, name='get_cheating_logs'),
    path("", include(router.urls)),  # Auto-generates CRUD URLs

]