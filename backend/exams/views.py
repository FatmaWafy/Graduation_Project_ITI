from datetime import timedelta
import json
import subprocess
from django.http import JsonResponse
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
from django.views.decorators.http import require_POST
from django.conf import settings
import logging

logger = logging.getLogger(__name__)



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
        """
        Assigns an exam to students and sends an email.
        Returns:
            - 400 if exam not found
            - 500 if email sending fails
            - 200 with list of assigned students on success
        """
        exam_id = request.data.get('exam_id')
        student_emails = request.data.get('students', [])  # List of student emails
        duration = request.data.get('duration', 60)  # Default 60 mins

        # Validate exam exists
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=status.HTTP_400_BAD_REQUEST)

        assigned_students = []
        failed_emails = []

        for email in student_emails:
            try:
                # Fetch student via related user email
                student = Student.objects.get(user__email=email)

                # Create temporary exam instance
                temp_exam = TemporaryExamInstance.objects.create(
                    exam=exam,
                    student=student,
                    start_time=now(),
                    end_time=now() + timedelta(minutes=duration)
                )

                assigned_students.append(email)

                # Prepare email content
                email_subject = f"Your Exam: {exam.title}"
                email_message = f"""
Dear {student.user.get_full_name() or student.user.username},

You have been assigned the exam: {exam.title}

Exam Duration: {duration} minutes
Available From: {temp_exam.start_time}
Available Until: {temp_exam.end_time}

Please log in to your account to take the exam.

Best regards,
{request.user.get_full_name() or 'Your Instructor'}
"""

                # Send email
                try:
                    send_mail(
                        subject=email_subject,
                        message=email_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False
                    )
                except Exception as e:
                    failed_emails.append(email)
                    logger.error(f"Failed to send exam email to {email}: {str(e)}")

            except Student.DoesNotExist:
                failed_emails.append(email)
                logger.warning(f"Student with email {email} not found")
            except Exception as e:
                failed_emails.append(email)
                logger.error(f"Error assigning exam to {email}: {str(e)}")

        response_data = {
            "message": "Exam assignment completed",
            "assigned_students": assigned_students,
            "total_assigned": len(assigned_students),
            "failed_emails": failed_emails
        }

        if failed_emails:
            response_data["warning"] = f"Failed to process {len(failed_emails)} students"

        return Response(response_data, status=status.HTTP_200_OK)
    
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


class StudentExamAnswerViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], url_path='submit-answer')
    @permission_classes([IsAuthenticated])
    def submit_exam_answer(self, request):
        student = request.user
        
        # Validate data structure
        if not isinstance(request.data, dict):
            return Response({"error": "Invalid data format. Expected a JSON object."}, 
                        status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Validate and extract exam_instance_id
            exam_instance_id = request.data.get('exam_instance')
            if not exam_instance_id:
                return Response({"error": "Missing exam_instance parameter."}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
            try:
                exam_instance_id = int(exam_instance_id)
            except (ValueError, TypeError):
                return Response({"error": "exam_instance must be an integer ID."}, 
                            status=status.HTTP_400_BAD_REQUEST)

            # Validate answer structures
            mcq_answers = request.data.get('mcq_answers', {})
            coding_answers = request.data.get('coding_answers', {})
            code_results = request.data.get('code_results', [])  # Frontend will send test results
            
            if not isinstance(mcq_answers, dict) or not isinstance(coding_answers, dict):
                return Response({"error": "mcq_answers and coding_answers must be dictionaries."}, 
                            status=status.HTTP_400_BAD_REQUEST)

            # Fetch the exam instance
            exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)
            exam_answer, _ = StudentExamAnswer.objects.get_or_create(
                student=student, 
                exam_instance=exam_instance
            )

            # Validate code_results structure
            for result in code_results:
                if not isinstance(result, dict) or 'question_id' not in result or 'test_results' not in result:
                    return Response({"error": "Invalid code_results format."}, 
                                status=status.HTTP_400_BAD_REQUEST)

            # Prepare answers to save
            answers_to_save = {
                "mcq_answers": mcq_answers,
                "code_answers": coding_answers,
                "code_results": code_results,
            }

            # Submit exam
            submission_response = exam_answer.submit_exam(answers_to_save)
            if isinstance(submission_response, str) or "error" in submission_response:
                error_msg = submission_response if isinstance(submission_response, str) else submission_response["error"]
                return Response({"error": error_msg}, 
                            status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "message": submission_response.get("message", "Answers submitted successfully"),
                "score": submission_response.get("score", 0),
                "code_results": code_results,
                "mcq_answers": mcq_answers,
                "coding_answers": coding_answers
            }, status=status.HTTP_201_CREATED)

        except TemporaryExamInstance.DoesNotExist:
            return Response({"error": "Exam instance not found."}, 
                        status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error in submit_exam_answer: {str(e)}")
            return Response({"error": "An unexpected error occurred."}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=False, methods=['get'])
    def get_student_answer(self, request, exam_instance_id):
        """ استرجاع إجابة الطالب لامتحان معين """
        student = request.user
        try:
            exam_answer = StudentExamAnswer.objects.get(student=student, exam_instance_id=exam_instance_id)
            exam_title = exam_answer.exam_instance.exam.title  # Access the exam title

            return Response({
                "exam_instance": exam_instance_id,
                "exam_title": exam_title,
                "score": exam_answer.score,
                "mcq_answers": exam_answer.get_answers().get("mcq_answers", {}),
                "coding_answers": exam_answer.get_answers().get("coding_answers", {})

            }, status=status.HTTP_200_OK)

        except StudentExamAnswer.DoesNotExist:
            return Response({"error": "Exam answer not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def get_all_student_scores(self, request):
        """ استرجاع جميع درجات الطالب لكل الامتحانات """

        exam_instance_ids = StudentExamAnswer.objects.values_list('exam_instance_id', flat=True).distinct()
        
        result = []

        for exam_instance_id in exam_instance_ids:
            exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)

            exam_title = exam_instance.exam.title
            start_datetime = exam_instance.start_datetime  # add this line

            exam_instance_answers = StudentExamAnswer.objects.filter(exam_instance_id=exam_instance_id)

            # Calculate the total points for the exam instance
            total_points = 0
            mcq_questions = MCQQuestion.objects.filter(exam=exam_instance.exam)
            total_points += sum([float(q.points) for q in mcq_questions])

            coding_questions = CodingQuestion.objects.filter(exam=exam_instance.exam)
            total_points += sum([float(q.points) for q in coding_questions])

            students_scores = [
                {
                    "student": answer.student.username,
                    "track": answer.student.student.track.name if hasattr(answer.student, 'student') and answer.student.student.track else None,
                    "score": answer.score,
                    "total_points": total_points,  # Add total points here
                    "mcq_answers": answer.get_answers().get("mcq_answers", {}),
                    "coding_answers": answer.get_answers().get("coding_answers", {}),
                }
                for answer in exam_instance_answers
            ]

            result.append({
                "exam_instance_id": exam_instance_id,
                "exam_title": exam_title,
                "start_datetime": start_datetime,
                "students_scores": students_scores
            })

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    @permission_classes([IsAuthenticated])
    def get_user_exams_scores(self, request):
        """ Fetch all exams and scores for the specified user from the token """
        student = request.user
        
        # Get all exam answers for the current user
        student_answers = StudentExamAnswer.objects.filter(student=student)

        result = []

        for exam_answer in student_answers:
            exam_instance = exam_answer.exam_instance
            exam_title = exam_instance.exam.title
            score = exam_answer.score

            # Calculate the total points for the exam (sum of MCQ and coding question points)
            total_points = 0

            # Get all MCQ questions for the exam_instance
            mcq_questions = MCQQuestion.objects.filter(exam=exam_instance.exam)
            total_points += sum([float(q.points) for q in mcq_questions])

            # Get all Coding questions for the exam_instance
            coding_questions = CodingQuestion.objects.filter(exam=exam_instance.exam)
            total_points += sum([float(q.points) for q in coding_questions])  

            # Add the result with the exam instance info and total points
            result.append({
                "exam_instance_id": exam_instance.id,
                "exam_title": exam_title,
                "score": score,
                "total_points": total_points,
            })

        if result:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No exams found for this user."}, status=status.HTTP_404_NOT_FOUND)
    
    
    @action(detail=False, methods=['get'])
    @permission_classes([IsAuthenticated])
    def get_answers(self, request):
        try:
            exam_instance_id = request.query_params.get('exam_instance_id')
            student_name = request.query_params.get('student_name')

            if not exam_instance_id or not student_name:
                return Response(
                    {"error": "Both exam_instance_id and student_name parameters are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                exam_instance_id = int(exam_instance_id)
            except ValueError:
                return Response(
                    {"error": "exam_instance_id must be an integer."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            student_answer = StudentExamAnswer.objects.get(
                exam_instance_id=exam_instance_id,
                student__username=student_name
            )

            exam_instance = student_answer.exam_instance
            answer_data = student_answer.get_answers()

            # Calculate total score (sum of points for MCQs and coding questions)
            total_points = 0

            # MCQ questions
            mcq_questions = MCQQuestion.objects.filter(exam=exam_instance.exam)
            total_points += sum([float(q.points) for q in mcq_questions])

            # Coding questions
            coding_questions = CodingQuestion.objects.filter(exam=exam_instance.exam)
            total_points += sum([float(q.points) for q in coding_questions])

            # Get MCQ answers
            mcq_answers = []

            for qid, selected_oid in answer_data.get("mcq_answers", {}).items():
                try:
                    # Fetch the question
                    question = MCQQuestion.objects.get(id=qid)

                    # Map the selected option ID to the corresponding option field
                    option_field = f"option_{selected_oid.lower()}"  # Example: 'option_a', 'option_b', etc.
                    selected_option = getattr(question, option_field, None)

                    # Get the correct option text based on the correct_option field
                    correct_option_field = f"option_{question.correct_option.lower()}"
                    correct_option = getattr(question, correct_option_field, None)

                    mcq_answers.append({
                        "question_id": qid,
                        "question_text": question.question_text,
                        "student_answer": selected_option if selected_option else "N/A",
                        "correct_answer": correct_option if correct_option else "N/A"
                    })

                except MCQQuestion.DoesNotExist:
                    continue

            # Get Coding answers
            coding_answers = []
            for qid, student_code in answer_data.get("coding_answers", {}).items():
                try:
                    coding_question = CodingQuestion.objects.get(id=qid)

                    # Prepare the response with the student's code and question details
                    coding_answers.append({
                        "question_id": qid,
                        "title": coding_question.title,
                        "description": coding_question.description,
                        "student_code": student_code  # Just the student's code
                    })

                except CodingQuestion.DoesNotExist:
                    continue

            # Response data combining MCQ and Coding answers
            response_data = {
                "exam_title": exam_instance.exam.title,
                "student_name": student_answer.student.get_full_name() or student_answer.student.username,
                "score" : student_answer.score,
                "total_points": total_points,  # Add total points here
                "mcq_answers": mcq_answers,
                "coding_answers": coding_answers,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except StudentExamAnswer.DoesNotExist:
            return Response(
                {"error": "No exam answers found for the specified student and exam instance."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in get_student_answers: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while fetching student answers."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
        
@csrf_exempt
@require_POST
def submit_code_results(request):
    try:
        data = json.loads(request.body)
        question_id = data.get('question_id')
        test_case_id = data.get('test_case_id')
        is_success = data.get('is_success')
        code = data.get('code')
        
        # Validate the data
        if not question_id or test_case_id is None or is_success is None:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
            
        # Get the question and test case
        try:
            question = CodingQuestion.objects.get(id=question_id)
            test_case = CodingTestCase.objects.get(id=test_case_id, question=question)
        except (CodingQuestion.DoesNotExist, CodingTestCase.DoesNotExist):
            return JsonResponse({'error': 'Question or test case not found'}, status=404)
            
        # Calculate score for this test case
        # If the test passes, award points proportional to the question's total points
        # divided by the number of test cases
        score = 0
        if is_success:
            total_test_cases = question.test_cases.count()
            if total_test_cases > 0:
                score = question.points / total_test_cases
                
        # You might want to store these results in your database
        # For example, create a model to track individual test case results
        
        return JsonResponse({
            'success': True,
            'score': score,
            'message': 'Test case result recorded successfully'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_code(request):
    try:
        data = request.data
        language = data.get('language')
        code = data.get('code')
        test_cases = data.get('testCases', [])

        if not language or not code:
            return Response({'error': 'Missing language or code'}, status=400)

        # Execute code against each test case
        results = []
        total_score = 0
        
        for test_case in test_cases:
            # Here you would execute the code against the test case
            # This is a simplified version - you'd need actual execution logic
            try:
                # Mock execution - replace with actual code execution
                expected_output = test_case.get('expected_output', '').strip()
                actual_output = "mock output"  # Replace with actual execution
                
                is_success = actual_output == expected_output
                score = test_case.get('points', 0) if is_success else 0
                
                results.append({
                    'test_case_id': test_case.get('id'),
                    'input': test_case.get('input_data'),
                    'expected_output': expected_output,
                    'actual_output': actual_output,
                    'is_success': is_success,
                    'score': score
                })
                
                total_score += score
                
            except Exception as e:
                results.append({
                    'test_case_id': test_case.get('id'),
                    'error': str(e),
                    'is_success': False,
                    'score': 0
                })

        return Response({
            'results': results,
            'total_score': total_score,
            'all_passed': all(r['is_success'] for r in results)
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)