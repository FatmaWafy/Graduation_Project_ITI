from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Exam, MCQQuestion, CodingQuestion, StudentExam, StudentAnswer
from .serializers import ExamSerializer, QuestionSerializer, StudentExamSerializer, StudentAnswerSerializer
from rest_framework import viewsets
from exams.serializers import MCQQuestionSerializer, CodingQuestionSerializer

# ✅ عرض وإنشاء الامتحانات
class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]  # لازم المستخدم يكون مسجل دخول

# ✅ تفاصيل امتحان معين
class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

# # ✅ تقديم إجابات الطالب للامتحان
# class StudentExamSubmitView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, pk):
#         student = request.user.student
#         exam = Exam.objects.get(pk=pk)
        
#         # إنشاء سجل الامتحان للطالب
#         student_exam, created = StudentExam.objects.get_or_create(student=student, exam=exam)

#         answers = request.data.get("answers", [])  # استلام الإجابات من الطلب
#         for ans in answers:
#             question = Question.objects.get(id=ans["question_id"])
#             if question.question_type == "mcq":
#                 StudentAnswer.objects.create(
#                     student_exam=student_exam,
#                     question=question,
#                     selected_answer_id=ans["selected_answer_id"]
#                 )
#             elif question.question_type == "code":
#                 StudentAnswer.objects.create(
#                     student_exam=student_exam,
#                     question=question,
#                     code_answer=ans["code_answer"]
#                 )

#         student_exam.calculate_score()  # حساب النتيجة
#         return Response({"message": "Exam submitted successfully", "score": student_exam.score})

# ✅ عرض نتائج الطالب
class StudentExamResultsView(generics.ListAPIView):
    serializer_class = StudentExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return StudentExam.objects.filter(student_id=student_id)

class MCQQuestionViewSet(viewsets.ModelViewSet):
    queryset = MCQQuestion.objects.all()
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated] 

class CodingQuestionViewSet(viewsets.ModelViewSet):
    queryset = CodingQuestion.objects.all()
    serializer_class = CodingQuestionSerializer
    permission_classes = [permissions.IsAuthenticated] 
