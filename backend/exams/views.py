from datetime import timedelta
import json
import subprocess
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from users.models import Student, User
from .models import CheatingLog, CodingQuestion, CodingTestCase, Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer,CodingTestCase
from .serializers import CheatingLogSerializer, CodingQuestionSerializer, CodingTestCaseSerializer, ExamSerializer, MCQQuestionSerializer, TempExamSerializer
from django.utils.timezone import now
import jwt
from rest_framework.permissions import IsAuthenticated
import sqlite3
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail


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
                    from_email="saraahamrr98@gmail.com",
                    recipient_list=[student.email],
                    fail_silently=True
                )

        return Response({"message": "Exam assigned", "students": assigned_students})

    @action(detail=True, methods=['get'])
    def get_questions(self, request, pk=None):
        """ Fetches all MCQ and Coding questions for a specific TempExam """
        try:
            temp_exam = self.get_object()  # Fetch the Temporary Exam
            exam = temp_exam.exam  # Get the associated exam
            
            # Fetch MCQ and Coding questions for the exam
            mcq_questions = MCQQuestion.objects.filter(exam=exam)
            coding_questions = CodingQuestion.objects.filter(exam=exam)

            # Combine the two sets of questions
            combined_questions = list(mcq_questions) + list(coding_questions)
            
            # Serialize the questions
            # Assuming you have separate serializers for both question types
            mcq_serializer = MCQQuestionSerializer(mcq_questions, many=True)
            coding_serializer = CodingQuestionSerializer(coding_questions, many=True)

            # Combine the serialized data from both serializers
            data = {
                'mcq_questions': mcq_serializer.data,
                'coding_questions': coding_serializer.data,
            }

            return Response(data)
        
        except TemporaryExamInstance.DoesNotExist:
            return Response({"error": "TempExam not found"}, status=404)



#filtered MCQ Questions
class FilteredMCQQuestionListView(generics.ListAPIView):
    serializer_class = MCQQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MCQQuestion.objects.all()
        
        # Filter by language if specified
        language = self.request.query_params.get('language')
        if language and language.lower() != "all":
            queryset = queryset.filter(language__iexact=language)

        # Filter by difficulty if specified
        difficulty = self.request.query_params.get('difficulty')
        if difficulty and difficulty.lower() != "all":
            queryset = queryset.filter(difficulty__iexact=difficulty)

        return queryset

class FilteredCodingQuestionListView(generics.ListAPIView):
    serializer_class = CodingQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = CodingQuestion.objects.all()
        
        # Filter by language if specified
        language = self.request.query_params.get('language')
        if language and language.lower() != "all":
            queryset = queryset.filter(language__iexact=language)

        # Filter by difficulty if specified
        difficulty = self.request.query_params.get('difficulty')
        if difficulty and difficulty.lower() != "all":
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
            

class CodingQuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
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

class CodingtestCaseViewSet(viewsets.ModelViewSet):
    queryset = CodingTestCase.objects.all()
    serializer_class = CodingTestCaseSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        queryset = CodingTestCase.objects.all()
        
        # Filter by question ID (if you want to filter by question)
        question_id = self.request.query_params.get('question_id')
        if question_id:
            queryset = queryset.filter(question_id=question_id)
        
        return queryset


# class StudentExamAnswerViewSet(viewsets.ViewSet):
#     @action(detail=False, methods=['post'], url_path='submit-answer')
#     @permission_classes([IsAuthenticated])
#     def submit_exam_answer(self, request):
#         student = request.user
        
#         # Validate data structure
#         if not isinstance(request.data, dict):
#             return Response({"error": "Invalid data format. Expected a JSON object."}, 
#                         status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             # Validate and extract exam_instance_id
#             exam_instance_id = request.data.get('exam_instance')
#             if not exam_instance_id:
#                 return Response({"error": "Missing exam_instance parameter."}, 
#                             status=status.HTTP_400_BAD_REQUEST)
            
#             try:
#                 exam_instance_id = int(exam_instance_id)
#             except (ValueError, TypeError):
#                 return Response({"error": "exam_instance must be an integer ID."}, 
#                             status=status.HTTP_400_BAD_REQUEST)

#             # Validate answer structures
#             mcq_answers = request.data.get('mcq_answers', {})
#             coding_answers = request.data.get('coding_answers', {})
#             code_results = request.data.get('code_results', [])  # Frontend will send test results
            
#             if not isinstance(mcq_answers, dict) or not isinstance(coding_answers, dict):
#                 return Response({"error": "mcq_answers and coding_answers must be dictionaries."}, 
#                             status=status.HTTP_400_BAD_REQUEST)

#             # Fetch the exam instance
#             exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)
#             exam_answer, _ = StudentExamAnswer.objects.get_or_create(
#                 student=student, 
#                 exam_instance=exam_instance
#             )

#             # Validate code_results structure
#             for result in code_results:
#                 if not isinstance(result, dict) or 'question_id' not in result or 'test_results' not in result:
#                     return Response({"error": "Invalid code_results format."}, 
#                                 status=status.HTTP_400_BAD_REQUEST)

#             # Prepare answers to save
#             answers_to_save = {
#                 "mcq_answers": mcq_answers,
#                 "code_answers": coding_answers,
#                 "code_results": code_results,
#             }

#             # Submit exam
#             submission_response = exam_answer.submit_exam(answers_to_save)
#             if isinstance(submission_response, str) or "error" in submission_response:
#                 error_msg = submission_response if isinstance(submission_response, str) else submission_response["error"]
#                 return Response({"error": error_msg}, 
#                             status=status.HTTP_400_BAD_REQUEST)

#             return Response({
#                 "message": submission_response.get("message", "Answers submitted successfully"),
#                 "score": submission_response.get("score", 0),
#                 "code_results": code_results,
#                 "mcq_answers": mcq_answers,
#                 "coding_answers": coding_answers
#             }, status=status.HTTP_201_CREATED)

#         except TemporaryExamInstance.DoesNotExist:
#             return Response({"error": "Exam instance not found."}, 
#                         status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             print(f"Error in submit_exam_answer: {str(e)}")
#             return Response({"error": "An unexpected error occurred."}, 
#                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class CheatingLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all the cheating logs
        logs = CheatingLog.objects.all()
        serializer = CheatingLogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Handle POST request to log cheating
        serializer = CheatingLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"status": "logged"})
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cheating_logs(request, exam_id):
        """
        Endpoint to get all cheating logs for a specific exam.
        """
        try:
            logs = CheatingLog.objects.filter(exam_id=exam_id)
            if not logs.exists():
                return Response({"message": "No logs found for this exam."}, status=404)

            serializer = CheatingLogSerializer(logs, many=True)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)