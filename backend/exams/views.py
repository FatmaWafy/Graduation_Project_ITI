from datetime import timedelta
from rest_framework import generics, permissions,viewsets,status
from datetime import timedelta
from rest_framework import generics, permissions,viewsets,status
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import Student
from .models import Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer
from .serializers import ExamSerializer, MCQQuestionSerializer, TempExamSerializer, StudentExamAnswerSerializer
from django.core.mail import send_mail
from django.utils.timezone import now
from rest_framework.decorators import action


from users.models import Student
from .models import Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer
from .serializers import ExamSerializer, MCQQuestionSerializer, TempExamSerializer, StudentExamAnswerSerializer
from django.core.mail import send_mail
from django.utils.timezone import now
from rest_framework.decorators import action



# ✅ عرض وإنشاء الامتحانات
class ExamListCreateView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated] # لازم المستخدم يكون مسجل دخول

# ✅ تفاصيل امتحان معين
class ExamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]


class TempExamViewSet(viewsets.ModelViewSet):
    queryset = TemporaryExamInstance.objects.all()
    serializer_class = TempExamSerializer

    @action(detail=False, methods=['post'])
    def assign_exam(self, request):
        """ Assigns an exam to students and sends an email """
        exam_id = request.data.get('exam_id')
        student_emails = request.data.get('students', [])  # List of student emails
        duration = request.data.get('duration', 60)  # Default 60 mins

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=400)

        assigned_students = []
        for email in student_emails:
            student = Student.objects.filter(email=email).first()
            if student:
                temp_exam = TemporaryExamInstance.objects.create(
                    exam=exam,
                    student=student,
                    start_time=now(),
                    end_time=now() + timedelta(minutes=duration)
                )
                assigned_students.append(temp_exam.student.email)

                # Send email
                send_mail(
                    subject=f"Your Exam: {exam.title}",
                    message=f"Hello {student.name},\nYou have been assigned the exam '{exam.title}'.\nStart Time: {temp_exam.start_time}\nEnd Time: {temp_exam.end_time}",
                    from_email="admin@example.com",
                    recipient_list=[student.email],
                    fail_silently=True
                )

        return Response({"message": "Exam assigned", "students": assigned_students})
# # ✅ تقديم إجابات الطالب للامتحان
# class StudentExamSubmitView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

class TempExamViewSet(viewsets.ModelViewSet):
    queryset = TemporaryExamInstance.objects.all()
    serializer_class = TempExamSerializer

    @action(detail=False, methods=['post'])
    def assign_exam(self, request):
        """ Assigns an exam to students and sends an email """
        exam_id = request.data.get('exam_id')
        student_emails = request.data.get('students', [])  # List of student emails
        duration = request.data.get('duration', 60)  # Default 60 mins

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=400)

        assigned_students = []
        for email in student_emails:
            student = Student.objects.filter(email=email).first()
            if student:
                temp_exam = TemporaryExamInstance.objects.create(
                    exam=exam,
                    student=student,
                    start_time=now(),
                    end_time=now() + timedelta(minutes=duration)
                )
                assigned_students.append(temp_exam.student.email)

                # Send email
                send_mail(
                    subject=f"Your Exam: {exam.title}",
                    message=f"Hello {student.name},\nYou have been assigned the exam '{exam.title}'.\nStart Time: {temp_exam.start_time}\nEnd Time: {temp_exam.end_time}",
                    from_email="admin@example.com",
                    recipient_list=[student.email],
                    fail_silently=True
                )

        return Response({"message": "Exam assigned", "students": assigned_students})
# # ✅ تقديم إجابات الطالب للامتحان
# class StudentExamSubmitView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, pk):
#         student = request.user.student
#         exam = Exam.objects.get(pk=pk)
#     def post(self, request, pk):
#         student = request.user.student
#         exam = Exam.objects.get(pk=pk)
        
#         # إنشاء سجل الامتحان للطالب
#         student_exam, created = StudentExam.objects.get_or_create(student=student, exam=exam)
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
#         student_exam.calculate_score()  # حساب النتيجة
#         return Response({"message": "Exam submitted successfully", "score": student_exam.score})

# ✅ عرض نتائج الطالب

class MCQQuestionViewSet(viewsets.ModelViewSet):
    queryset = MCQQuestion.objects.all()
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated] 

class MCQQuestionViewSet(viewsets.ModelViewSet):
    queryset = MCQQuestion.objects.all()
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated] 

# class CodingQuestionViewSet(viewsets.ModelViewSet):
#     queryset = CodingQuestion.objects.all()
#     serializer_class = CodingQuestionSerializer
#     permission_classes = [permissions.IsAuthenticated] 


# Views
class StudentExamAnswerViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def submit_exam_answer(self, request):
        student = request.user
        exam_instance_id = request.data.get('exam_instance')
        answers = request.data.get('mcq_answers', {})

        try:
            exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)
            
            # التحقق إذا انتهى وقت الامتحان
            if now() > exam_instance.end_datetime:
                return Response({"error": "Time is up! You can't submit this exam."}, status=status.HTTP_400_BAD_REQUEST)

            # جلب أو إنشاء إجابة الطالب
            exam_answer, created = StudentExamAnswer.objects.get_or_create(
                student=student, exam_instance=exam_instance
            )

            # حفظ الإجابات وحساب الدرجة
            exam_answer.set_answers({"mcq_answers": answers})
            exam_answer.calculate_score()

            return Response({"message": "Answers submitted successfully.", "score": exam_answer.score},
                status=status.HTTP_201_CREATED)

        except TemporaryExamInstance.DoesNotExist:
            return Response({"error": "Exam instance not found."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def get_student_answer(self, request, exam_instance_id):
        """ استرجاع إجابة الطالب لامتحان معين """
        student = request.user
        try:
            exam_answer = StudentExamAnswer.objects.get(student=student, exam_instance_id=exam_instance_id)
            return Response({
                "exam_instance": exam_instance_id,
                "score": exam_answer.score,
                "mcq_answers": exam_answer.get_answers().get("mcq_answers", {})
            }, status=status.HTTP_200_OK)

        except StudentExamAnswer.DoesNotExist:
            return Response({"error": "Exam answer not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def get_all_student_scores(self, request):
        """ استرجاع جميع درجات الطالب لكل الامتحانات """
        student = request.user
        exam_answers = StudentExamAnswer.objects.filter(student=student)

        result = [
            {
                "exam_instance": exam_answer.exam_instance_id,
                "score": exam_answer.score,
                "mcq_answers": exam_answer.get_answers().get("mcq_answers", {})
            }
            for exam_answer in exam_answers
        ]

        return Response({"scores": result}, status=status.HTTP_200_OK)



class CreateExamView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        title = data.get("title")
        duration = data.get("duration")
        questions = data.get("questions", [])

        if not title or not duration:
            return Response({"error": "Title and duration are required."}, status=status.HTTP_400_BAD_REQUEST)

        exam = Exam.objects.create(title=title, duration=duration)

        for q in questions:
            if q["type"] == "mcq":
                mcq = MCQQuestion.objects.create(
                    question_text=q["question"],
                    option_a=q["options"][0],
                    option_b=q["options"][1],
                    option_c=q["options"][2] if len(q["options"]) > 2 else None,
                    option_d=q["options"][3] if len(q["options"]) > 3 else None,
                    correct_option=q["correctAnswers"][0] if q["correctAnswers"] else None,
                    difficulty="Medium",  # افتراضيًا
                    source="Exam System",
                    points=1.0
                )
                exam.MCQQuestions.add(mcq)

        exam.save()
        return Response({"message": "Exam created successfully!"}, status=status.HTTP_201_CREATED)



def get_questions(request):
    # استلام المعرفات للأسئلة
    question_ids = request.data.get('questionIds', [])
    
    # البحث عن الأسئلة بناءً على المعرفات
    questions = MCQQuestion.objects.filter(id__in=question_ids)
    
    # تسلسل البيانات لعرضها
    serialized_questions = MCQQuestionSerializer(questions, many=True)
    
    # إرجاع الأسئلة كاستجابة
    return Response({"questions": serialized_questions.data})