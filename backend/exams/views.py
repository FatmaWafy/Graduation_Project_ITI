from datetime import timedelta
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from exams.utils import run_code_by_language
from users.models import Student, User
from .models import CodingQuestion, Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer
from .serializers import CodingQuestionSerializer, ExamSerializer, MCQQuestionSerializer, TempExamSerializer
from django.core.mail import send_mail
from django.utils.timezone import now
from rest_framework.decorators import action
import jwt
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
import sqlite3
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status, viewsets
from .models import TemporaryExamInstance, StudentExamAnswer, CodingQuestion


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

    @action(detail=True, methods=['get'])
    def get_questions(self, request, pk=None):
        """ Fetches all MCQ questions for a specific TempExam """
        try:
            temp_exam = self.get_object()  # جلب الامتحان المؤقت
            exam = temp_exam.exam  # جلب الامتحان المرتبط
            questions = MCQQuestion.objects.filter(exam=exam)  # جلب الأسئلة المرتبطة بالامتحان
            serializer = MCQQuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except TemporaryExamInstance.DoesNotExist:
            return Response({"error": "TempExam not found"}, status=404)


# # ✅ تقديم إجابات الطالب للامتحان
# class StudentExamSubmitView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#filtered MCQ Questions
class FilteredMCQQuestionListView(generics.ListAPIView):
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MCQQuestion.objects.all()
        difficulty = self.request.query_params.get('difficulty')
        if difficulty and difficulty.lower() != "all":
            # Assuming your model stores values as "Easy", "Medium", "Hard"
            queryset = queryset.filter(difficulty__iexact=difficulty)
        return queryset
    

# ✅ عرض نتائج الطالب

class MCQQuestionViewSet(viewsets.ModelViewSet):
    queryset = MCQQuestion.objects.all()
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check if the input data is a list (bulk create) or a single object
        many = isinstance(request.data, list)
        
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

# class CodingQuestionViewSet(viewsets.ModelViewSet):
#     queryset = CodingQuestion.objects.all()
#     serializer_class = CodingQuestionSerializer
#     permission_classes = [permissions.IsAuthenticated] 


# # Views #################### old code
# class StudentExamAnswerViewSet(viewsets.ViewSet):
#     @action(detail=False, methods=['post'])
#     def submit_exam_answer(self, request):
#         student = request.user
#         exam_instance_id = request.data.get('exam_instance')
#         answers = request.data.get('mcq_answers', {})

#         try:
#             # Get the exam instance
#             exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)

#             # Get or create the student's exam answer
#             exam_answer = StudentExamAnswer.objects.get_or_create(
#                 student=student, exam_instance=exam_instance
#             )[0]

#             # Submit the exam answer using the method in models.py
#             response = exam_answer.submit_exam({"mcq_answers": answers})

#             # If the response contains an error (like time expired), return that error
#             if "error" in response:
#                 return Response({"error": response["error"]}, status=status.HTTP_400_BAD_REQUEST)

#             # Otherwise, return success and the calculated score
#             return Response({"message": response["message"], "score": response["score"]}, status=status.HTTP_201_CREATED)

#         except TemporaryExamInstance.DoesNotExist:
#             return Response({"error": "Exam instance not found."}, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=False, methods=['get'])
#     def get_student_answer(self, request, exam_instance_id):
#         """ استرجاع إجابة الطالب لامتحان معين """
#         student = request.user
#         try:
#             exam_answer = StudentExamAnswer.objects.get(student=student, exam_instance_id=exam_instance_id)
#             return Response({
#                 "exam_instance": exam_instance_id,
#                 "score": exam_answer.score,
#                 "mcq_answers": exam_answer.get_answers().get("mcq_answers", {})
#             }, status=status.HTTP_200_OK)

#         except StudentExamAnswer.DoesNotExist:
#             return Response({"error": "Exam answer not found."}, status=status.HTTP_404_NOT_FOUND)

#     @action(detail=False, methods=['get'])
#     def get_all_student_scores(self, request):
#         """ استرجاع جميع درجات الطالب لكل الامتحانات """
#         student = request.user
#         exam_answers = StudentExamAnswer.objects.filter(student=student)

#         result = [
#             {
#                 "exam_instance": exam_answer.exam_instance_id,
#                 "score": exam_answer.score,
#                 "mcq_answers": exam_answer.get_answers().get("mcq_answers", {})
#             }
#             for exam_answer in exam_answers
#         ]

#         return Response({"scores": result}, status=status.HTTP_200_OK)


class GetTempExamByTrack(APIView):
    def get(self, request, track_id):
        """
        View to get temporary exam instances filtered by track ID.
        """
        # Filter TemporaryExamInstance by track_id
        temp_exams = TemporaryExamInstance.objects.filter(track_id=track_id)

        # If no exams found, return an error message
        if not temp_exams:
            return Response({"error": "No temporary exams found for this track"}, status=404)

        # Serialize the results using TempExamSerializer
        serializer = TempExamSerializer(temp_exams, many=True)

        # Return the serialized data in the response
        return Response({"temp_exams": serializer.data}, status=200)
    

class GetTempExamByStudent(APIView):
    def get(self, request, student_id):
        try:
            # 1. Get the User object
            user = User.objects.get(id=student_id)
            
            # 2. Get the Student profile
            try:
                student = Student.objects.get(user=user)
            except Student.DoesNotExist:
                return Response(
                    {"error": "No student profile found for this user"}, 
                    status=404
                )
            
            # 3. Filter exams by student ID
            temp_exams = TemporaryExamInstance.objects.filter(students=student.id)
            
            if not temp_exams.exists():
                return Response(
                    {"error": "No temporary exams found for this student"}, 
                    status=404
                )
            
            serializer = TempExamSerializer(temp_exams, many=True)
            return Response({"temp_exams": serializer.data}, status=200)
            
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=404
            )
            

class CodingQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CodingQuestion.objects.all()
    serializer_class = CodingQuestionSerializer
    
    def get_queryset(self):
        queryset = CodingQuestion.objects.all()
        
        # Filter by difficulty
        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty.lower())
        
        # Filter by tags
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__contains=[tag])
        
        return queryset




class StudentExamAnswerViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def submit_exam_answer(self, request):
        student = request.user
        exam_instance_id = request.data.get('exam_instance')
        mcq_answers = request.data.get('mcq_answers', {})
        code_answers = request.data.get('code_answers', {})  # {question_id: code}

        try:
            exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)
            exam_answer = StudentExamAnswer.objects.get_or_create(
                student=student, exam_instance=exam_instance
            )[0]

            mcq_response = exam_answer.submit_exam({"mcq_answers": mcq_answers})

            code_results = []
            for question_id, code in code_answers.items():
                question = CodingQuestion.objects.get(id=question_id)
                test_cases = question.test_cases.all()

                result = self.run_code_and_test(code, question.language, test_cases)
                score_sum = sum([r.get("score", 0) for r in result])
                code_results.append({
                    "question_id": question_id,
                    "score": score_sum,
                    "test_results": result
                })

            if "error" in mcq_response:
                return Response({"error": mcq_response["error"]}, status=status.HTTP_400_BAD_REQUEST)

            total_score = mcq_response["score"] + sum([r["score"] for r in code_results])

            return Response({
                "message": mcq_response["message"],
                "score": total_score,
                "code_results": code_results
            }, status=status.HTTP_201_CREATED)

        except TemporaryExamInstance.DoesNotExist:
            return Response({"error": "Exam instance not found."}, status=status.HTTP_400_BAD_REQUEST)

    def run_code_and_test(self, code, language, test_cases):
        results = []

        for test_case in test_cases:
            input_data = test_case.input_data
            expected_output = test_case.expected_output

            if language == "sql":
                try:
                    conn = sqlite3.connect(":memory:")
                    cursor = conn.cursor()
                    cursor.executescript(input_data)  # Create tables + insert test data
                    cursor.execute(code)
                    result = cursor.fetchall()

                    expected = eval(expected_output)  # [(1, 'Alice'), (2, 'Bob')]
                    if result == expected:
                        results.append({"test_case_id": test_case.id, "score": 1})
                    else:
                        results.append({
                            "test_case_id": test_case.id,
                            "score": 0,
                            "output": result,
                            "expected": expected
                        })
                except Exception as e:
                    results.append({"test_case_id": test_case.id, "error": str(e)})
                finally:
                    conn.close()

            else:
                output = run_code_by_language(code, language, input_data)
                if "error" in output:
                    results.append({"test_case_id": test_case.id, "error": output["error"]})
                else:
                    if output["output"].strip() == expected_output.strip():
                        results.append({"test_case_id": test_case.id, "score": 1})
                    else:
                        results.append({
                            "test_case_id": test_case.id,
                            "score": 0,
                            "output": output["output"],
                            "expected": expected_output.strip()
                        })

        return results
