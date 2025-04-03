from datetime import timedelta
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.utils.timezone import now
from users.models import Student
from .models import Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer
from .serializers import ExamSerializer, MCQQuestionSerializer, TempExamSerializer, StudentExamAnswerSerializer
from rest_framework.permissions import IsAuthenticated


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


# ✅ عرض وتعيين الامتحانات المؤقتة
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


# ✅ تقديم إجابات الطالب للامتحان
class StudentExamAnswerViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def submit_exam_answer(self, request):
        student = request.user
        exam_instance_id = request.data.get('exam_instance')
        answers = request.data.get('mcq_answers', {})

        try:
            # Get the exam instance
            exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)

            # Get or create the student's exam answer
            exam_answer = StudentExamAnswer.objects.get_or_create(
                student=student, exam_instance=exam_instance
            )[0]

            # Submit the exam answer using the method in models.py
            response = exam_answer.submit_exam({"mcq_answers": answers})

            # If the response contains an error (like time expired), return that error
            if "error" in response:
                return Response({"error": response["error"]}, status=status.HTTP_400_BAD_REQUEST)

            # Otherwise, return success and the calculated score
            return Response({"message": response["message"], "score": response["score"]}, status=status.HTTP_201_CREATED)

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


# ✅ عرض الأسئلة ذات الإجابة المتعددة الاختيارات
class MCQQuestionViewSet(viewsets.ModelViewSet):
    queryset = MCQQuestion.objects.all()
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ إنشاء الامتحان
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


# ✅ عرض الأسئلة
def get_questions(request):
    # استلام المعرفات للأسئلة
    question_ids = request.data.get('questionIds', [])
    
    # البحث عن الأسئلة بناءً على المعرفات
    questions = MCQQuestion.objects.filter(id__in=question_ids)
    
    # تسلسل البيانات لعرضها
    serialized_questions = MCQQuestionSerializer(questions, many=True)
    
    # إرجاع الأسئلة كاستجابة
    return Response({"questions": serialized_questions.data})
class ExamQuestionsView(generics.ListAPIView):
    """ Fetch all questions related to a specific exam """
    serializer_class = MCQQuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """ Return questions related to the specified exam """
        exam_id = self.kwargs.get('exam_id')
        try:
            exam = Exam.objects.get(id=exam_id)
            return MCQQuestion.objects.filter(exam=exam)  # assuming there's a relationship between MCQQuestion and Exam
        except Exam.DoesNotExist:
            return MCQQuestion.objects.none()  # return empty queryset if exam doesn't exist