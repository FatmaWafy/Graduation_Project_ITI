from datetime import datetime, timedelta, timezone
import json
import subprocess
from django.http import FileResponse, JsonResponse
from numpy import convolve
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from st_notifications.models import Note
from users.models import Course, Instructor, Student, User
from .models import CheatingLog, CodingQuestion, CodingTestCase, Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer,CodingTestCase,Branch
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
from django.utils import timezone
from django.db.models import Q


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
    permission_classes = [permissions.IsAuthenticated]
    queryset = TemporaryExamInstance.objects.all()
    serializer_class = TempExamSerializer

    @action(detail=False, methods=['post'])
    def assign_exam(self, request):
        """
        Assigns an exam to students and sends an email and notification.
        """
        exam_id = request.data.get('exam_id')
        student_ids = request.data.get('students', [])
        duration = request.data.get('duration', 60)
        instructor_id = request.data.get('instructor_id')  # ✅ FIXED

        # Validate exam exists
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate instructor exists
        try:
            instructor = Instructor.objects.get(id=instructor_id)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found"}, status=status.HTTP_400_BAD_REQUEST)

        # Get the instructor's associated tracks
        instructor_tracks = instructor.tracks.all()  # ✅ using related_name from Track model

        # Filter students based on the tracks assigned to the instructor
        students_in_tracks = Student.objects.filter(track__in=instructor_tracks)

        # Further filter based on provided student IDs
        if student_ids:
            students_in_tracks = students_in_tracks.filter(id__in=student_ids)

        assigned_students = []
        failed_students = []

        for student in students_in_tracks:
            try:
                # Create the temporary exam instance (without assigning students yet)
                temp_exam = TemporaryExamInstance.objects.create(
                    exam=exam,
                    branch=student.branch,
                    start_datetime=datetime.now(),
                    end_datetime=datetime.now() + timedelta(minutes=duration),
                    instructor_id=instructor
                )

                # Add the student to the M2M field
                temp_exam.students.add(student)
                assigned_students.append(student.id)

                # TODO: send email and/or notification to student here

            except Exception as e:
                failed_students.append(student.id)
                logger.error(f"Error assigning exam to student ID {student.id}: {str(e)}")

        response_data = {
            "message": "Exam assignment completed",
            "assigned_students": assigned_students,
            "total_assigned": len(assigned_students),
            "failed_students": failed_students
        }

        if failed_students:
            response_data["warning"] = f"Failed to process {len(failed_students)} students"

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
    
    @action(detail=False, methods=['get'])
    def get_exam_info(self, request):
        """Returns all temp exam info (title and temp exam ID) filtered by instructor ID"""
        instructor_id = request.query_params.get('instructor_id')

        if not instructor_id:
            return Response({"error": "instructor_id is required"}, status=400)

        try:
            temp_exams = TemporaryExamInstance.objects.filter(instructor_id_id=instructor_id)

            if not temp_exams.exists():
                return Response({"error": "No TempExam found for this instructor"}, status=404)

            data = [
                {
                    'temp_exam_id': temp_exam.id,
                    'exam_title': temp_exam.exam.title,
                    'exam_date': temp_exam.start_datetime.strftime('%Y-%m-%d %H:%M:%S'),
                }
                for temp_exam in temp_exams
            ]

            return Response(data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)




class ExamViewSet(viewsets.ModelViewSet):
    queryset = TemporaryExamInstance.objects.all()
    serializer_class = TempExamSerializer

    # @action(detail=False, methods=['post'])
    # def assign_exam(self, request):
    #     """
    #     Assigns an exam to students and sends an email and notification.
    #     """
    #     exam_id = request.data.get('exam_id')  # ID of the exam to assign
    #     student_ids = request.data.get('students', [])  # List of student IDs
    #     duration = request.data.get('duration', 60)  # Default 60 mins

    #     # Validate exam exists
    #     try:
    #         exam = Exam.objects.get(id=exam_id)
    #     except Exam.DoesNotExist:
    #         return Response({"error": "Exam not found"}, status=status.HTTP_400_BAD_REQUEST)

    #     assigned_students = []
    #     failed_students = []

    #     for student_id in student_ids:
    #         try:
    #             # Fetch student via student ID
    #             student = Student.objects.get(id=student_id)

    #             # Create temporary exam instance
    #             temp_exam = TemporaryExamInstance.objects.create(
    #                 exam=exam,
    #                 students=None,  # Initially leave the students empty
    #                 branch=student.branch,  # Assuming the branch is stored in the student model
    #                 start_datetime=datetime.now(),
    #                 end_datetime=datetime.now() + timedelta(minutes=duration)
    #             )

    #             # Add student to the many-to-many relationship
    #             temp_exam.students.add(student)  # Use .add() instead of direct assignment

    #             assigned_students.append(student.id)

    #             # Prepare email content
    #             email_subject = f"Your Exam: {exam.title}"
    #             email_message = f"""
    #             Dear {student.user.get_full_name() or student.user.username},

    #             You have been assigned the exam: {exam.title}

    #             Exam Duration: {duration} minutes
    #             Available From: {temp_exam.start_datetime}
    #             Available Until: {temp_exam.end_datetime}

    #             Please log in to your account to take the exam.

    #             Best regards,
    #             {request.user.get_full_name() or 'Your Instructor'}
    #             """

    #             # Send email
    #             try:
    #                 send_mail(
    #                     subject=email_subject,
    #                     message=email_message,
    #                     from_email=settings.DEFAULT_FROM_EMAIL,
    #                     recipient_list=[student.user.email],
    #                     fail_silently=False
    #                 )
    #             except Exception as e:
    #                 failed_students.append(student.id)
    #                 logger.error(f"Failed to send exam email to {student.user.email}: {str(e)}")

    #             # Create a notification/note for the student
    #             message = f"You have been assigned the exam: {exam.title}. Please check your account for further details."
    #             Note.objects.create(
    #                 instructor=request.user.instructor,  # Assuming the instructor is logged in
    #                 student=student,
    #                 message=message
    #             )

    #         except Student.DoesNotExist:
    #             failed_students.append(student_id)
    #             logger.warning(f"Student with ID {student_id} not found")
    #         except Exception as e:
    #             failed_students.append(student_id)
    #             logger.error(f"Error assigning exam to student ID {student_id}: {str(e)}")

    #     response_data = {
    #         "message": "Exam assignment completed",
    #         "assigned_students": assigned_students,
    #         "total_assigned": len(assigned_students),
    #         "failed_students": failed_students
    #     }

    #     if failed_students:
    #         response_data["warning"] = f"Failed to process {len(failed_students)} students"

    #     return Response(response_data, status=status.HTTP_200_OK)


    
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

from django.db.models import Sum  # This is the critical import for the aggregation

class StudentExamAnswerViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], url_path='submit-answer')
    @permission_classes([IsAuthenticated])
    def submit_exam_answer(self, request):
        student = request.user
        # Validate user is a student
        if not hasattr(student, 'student'):
            return Response({"error": "User is not a student."}, 
                        status=status.HTTP_403_FORBIDDEN)
            
        
        # Validate data structure
        if not isinstance(request.data, dict):
            return Response({"error": "Invalid data format. Expected a JSON object."}, 
                        status=status.HTTP_400_BAD_REQUEST)
        
        try:
            exam_instance_id = request.data.get('exam_instance')
            if not exam_instance_id:
                return Response({"error": "Missing exam_instance parameter."}, 
                            status=status.HTTP_400_BAD_REQUEST)
            
            try:
                exam_instance_id = int(exam_instance_id)
            except (ValueError, TypeError):
                return Response({"error": "exam_instance must be an integer ID."}, 
                            status=status.HTTP_400_BAD_REQUEST)

            # Get the exam instance
            exam_instance = TemporaryExamInstance.objects.get(id=exam_instance_id)
            
            # Prepare answers data
            answers_data = {
                'mcq_answers': request.data.get('mcq_answers', {}),
                'coding_answers': request.data.get('coding_answers', {}),
                'code_results': request.data.get('code_results', [])
            }

            # Create or get the exam answer record
            exam_answer, created = StudentExamAnswer.objects.get_or_create(
                student=Student.objects.get(user__username=Student.objects.get(user=student).user.username)  ,
                 
                exam_instance=exam_instance
            )

            # Submit the exam using the model's method
            result = exam_answer.submit_exam(answers_data)
            
            if "error" in result:
                return Response({"error": result["error"]}, 
                            status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "message": "Answers submitted successfully",
                "score": exam_answer.score,
                "exam_instance": exam_instance_id,
                "exam_title": exam_instance.exam.title
            }, status=status.HTTP_201_CREATED)

        except TemporaryExamInstance.DoesNotExist:
            return Response({"error": "Exam instance not found."}, 
                        status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in submit_exam_answer: {str(e)}", exc_info=True)
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def get_student_answer(self, request, exam_instance_id):
        """Get a student's answers for a specific exam instance"""
        student = request.user
        
        try:
            exam_answer = StudentExamAnswer.objects.get(
                student=student, 
                exam_instance_id=exam_instance_id
            )
            
            answers = exam_answer.get_answers()
            exam_instance = exam_answer.exam_instance
            
            return Response({
                "exam_instance": int(exam_instance_id),
                "exam_title": exam_instance.exam.title,
                "score": exam_answer.score,
                "mcq_answers": answers.get("mcq_answers", {}),
                "coding_answers": answers.get("coding_answers", {}),
                "code_results": answers.get("code_results", [])
            }, status=status.HTTP_200_OK)

        except StudentExamAnswer.DoesNotExist:
            return Response({"error": "Exam answer not found."}, 
                         status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error in get_student_answer: {str(e)}", exc_info=True)
            return Response({"error": f"An error occurred: {str(e)}"}, 
                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
    @action(detail=False, methods=['get'])
    def get_all_student_scores(self, request):
        user = request.user

        if not user:
            return Response({"error": "instructor_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instructor = Instructor.objects.get(user=user)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all exam instances assigned by this instructor
        exam_instances = TemporaryExamInstance.objects.filter(instructor_id__user=request.user)

        # Get student answers related to these exam instances
        answers = StudentExamAnswer.objects.filter(
            exam_instance__in=exam_instances
        ).select_related('student', 'exam_instance__exam')

        # Prepare the results
        results = []
        for answer in answers:
            results.append({
                "student_id": answer.student.id,
                "student_username": answer.student.user.username,
                'branch': answer.student.branch.name if answer.student.branch else None,
                'track': answer.student.track.name if answer.student.track else None,
                "exam_id": answer.exam_instance.id,
                "exam_title": answer.exam_instance.exam.title,
                "score": answer.score,
                "submitted_at": answer.submitted_at
            })
        return Response({"grades": results}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_answers(self, request):
        """Get detailed answers for a specific student and exam"""
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

            # Get the student object by username
            try:
                student = Student.objects.get(user__username=student_name)          
            # student = Student.objects.get(user__username=student_name)                
            except Student.DoesNotExist:
                return Response(
                    {"error": f"Student with username {student_name} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get the student's answer for this exam instance
            try:
                student_answer = StudentExamAnswer.objects.get(
                    exam_instance_id=exam_instance_id,
                    student=student
                )
            except StudentExamAnswer.DoesNotExist:
                return Response(
                    {"error": "No answers found for this student and exam instance."},
                    status=status.HTTP_404_NOT_FOUND
                )

            exam_instance = student_answer.exam_instance
            answer_data = student_answer.get_answers()

            # Calculate total possible points
            mcq_total = MCQQuestion.objects.filter(
                exam=exam_instance.exam
            ).aggregate(total=Sum('points'))['total'] or 0

            coding_total = CodingQuestion.objects.filter(
                exam=exam_instance.exam
            ).aggregate(total=Sum('points'))['total'] or 0

            mcq_points = float(mcq_total) if mcq_total else 0.0
            coding_points = float(coding_total) if coding_total else 0.0

            total_points = mcq_points + coding_points

            # Format MCQ answers with question details
            mcq_answers = []
            for qid, selected_oid in answer_data.get("mcq_answers", {}).items():
                try:
                    question = MCQQuestion.objects.get(id=qid)
                    option_field = f"option_{selected_oid.lower()}"
                    selected_option = getattr(question, option_field, None)

                    correct_option_field = f"option_{question.correct_option.lower()}"
                    correct_option = getattr(question, correct_option_field, None)

                    mcq_answers.append({
                        "question_id": qid,
                        "question_text": question.question_text,
                        "student_answer": selected_option or "N/A",
                        "correct_answer": correct_option or "N/A",
                        "is_correct": selected_oid.upper() == question.correct_option.upper()
                    })
                except MCQQuestion.DoesNotExist:
                    continue

            # Format coding answers with question details
            coding_answers = []
            for qid, student_code in answer_data.get("coding_answers", {}).items():
                try:
                    coding_question = CodingQuestion.objects.get(id=qid)

                    test_results = next(
                        (r.get('test_results', []) for r in answer_data.get('code_results', []) 
                        if str(r.get('question_id')) == str(qid)),
                        []
                    )

                    passed = sum(1 for t in test_results if t.get('isSuccess', False))
                    total = len(test_results)
                    pass_rate = f"{passed}/{total}"

                    coding_answers.append({
                        "question_id": qid,
                        "title": coding_question.title,
                        "description": coding_question.description,
                        "student_code": student_code,
                        "test_results": test_results,
                        "pass_rate": pass_rate,
                        "all_passed": passed == total and total > 0
                    })
                except CodingQuestion.DoesNotExist:
                    continue

            response_data = {
                "exam_title": exam_instance.exam.title,
                "student_name": student_answer.student.user.username,
                "score": student_answer.score,
                "total_points": total_points,
                "mcq_answers": mcq_answers,
                "coding_answers": coding_answers,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @action(detail=False, methods=['get'])
    def get_user_exams_scores(self, request):
        """Get all exams and scores for the current user"""
        student = request.user
        
        try:
            # Get all exam answers for the current user
            student_answers = StudentExamAnswer.objects.filter(student=Student.objects.get(user__username=Student.objects.get(user=student).user.username) )
            if not student_answers.exists():    
                return Response({"message": "No exams found for this user."}, 
                            status=status.HTTP_404_NOT_FOUND)
            # Prepare the results

            result = []

            for exam_answer in student_answers:
                exam_instance = exam_answer.exam_instance
                exam_title = exam_instance.exam.title
                score = exam_answer.score

                # Calculate total possible points for the exam
                mcq_total = MCQQuestion.objects.filter(
                    exam=exam_instance.exam
                ).aggregate(total=Sum('points'))['total'] or 0
                
                coding_total = CodingQuestion.objects.filter(
                    exam=exam_instance.exam
                ).aggregate(total=Sum('points'))['total'] or 0
                
                # Convert to float to ensure consistent type
                try:
                    mcq_points = float(mcq_total)
                except (ValueError, TypeError):
                    mcq_points = 0.0
                    
                try:
                    coding_points = float(coding_total)
                except (ValueError, TypeError):
                    coding_points = 0.0
                
                total_points = mcq_points + coding_points

                # Add to results
                result.append({
                    "exam_instance_id": exam_instance.id,
                    "exam_title": exam_title,
                    "score": score,
                    "total_points": total_points,
                })

            if result:
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No exams found for this user."}, 
                            status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            import traceback
            print(f"Error in get_user_exams_scores: {str(e)}")
            print(traceback.format_exc())
            return Response({"error": f"An error occurred: {str(e)}"}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheatingLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = CheatingLog.objects.all()
        serializer = CheatingLogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CheatingLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # ربط الـ log بالمستخدم اللي في التوكن
            return Response({"status": "logged"})
        return Response(serializer.errors, status=400)

    def delete_old_logs(self):
        """
        حذف السجلات التي مضى عليها أكثر من يومين.
        """
        expiration_time = timezone.now() - timedelta(days=2)
        old_logs = CheatingLog.objects.filter(timestamp__lt=expiration_time)

        if old_logs.exists():
            deleted_count, _ = old_logs.delete()
            print(f"{deleted_count} logs were deleted.")


from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cheating_logs(request, exam_id):
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
    
class ExportBubbleSheetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
            file_path = generate_bubble_sheet(exam)
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=f"bubble_sheet_exam_{exam_id}.pdf")
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=404)


from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime



def generate_bubble_sheet(exam):
    file_path = f"exams/media/exams/exam_{exam.title}_id_{exam.id}.pdf"
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4
    margin = 20 * mm
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        name="Title",
        parent=styles["Title"],
        fontSize=16,
        spaceAfter=10,
        textColor=colors.purple,
        alignment=0,  # Left alignment
    )
    heading_style = ParagraphStyle(
        name="Heading",
        parent=styles["Heading2"],
        fontSize=14,
        spaceAfter=8,
        textColor=colors.purple,
    )
    normal_style = ParagraphStyle(
        name="Normal",
        parent=styles["Normal"],
        fontSize=10,
        leading=12,
        spaceAfter=6,
    )
    instruction_style = ParagraphStyle(
        name="Instruction",
        parent=styles["Italic"],
        fontSize=10,
        spaceAfter=10,
        textColor=colors.darkgrey,
        leading=14,
    )
    code_style = ParagraphStyle(
        name="Code",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=9,
        leading=12,
    )

    def draw_header(title=None):
        """Draw the header section of the page"""
        # Use the exam title or a provided override title
        sheet_title = title if title else exam.title
        
        # Create paragraph for title to handle longer titles better
        title_para = Paragraph(f"<b>{sheet_title}</b>", title_style)
        title_para.wrapOn(c, width - 2 * margin, 20 * mm)
        title_para.drawOn(c, margin, height - 25 * mm)  # Moved up by 5mm
        
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.black)
        course = exam.course.name if hasattr(exam, 'course') and exam.course else "N/A"
        c.drawString(margin, height - 35 * mm, f"Course: {course}")  # Adjusted positions
        c.drawString(margin, height - 41 * mm, f"Duration: {exam.duration} minutes")
        c.drawString(margin, height - 47 * mm, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
        
        # Draw a horizontal line
        c.setLineWidth(0.5)
        c.line(margin, height - 51 * mm, width - margin, height - 51 * mm)  # Moved up

    def draw_instructions():
        """Draw the instructions section"""
        instructions = Paragraph(
            """
            <i><b>Instructions:</b><br/>
            - Use a No. 2 pencil to fill in the bubbles completely.<br/>
            - For multiple-choice questions, select one answer by filling the corresponding bubble.<br/>
            - For coding questions, write your code in the provided answer space.<br/>
            - Do not make stray marks on the sheet.</i>
            """,
            instruction_style,
        )
        instructions.wrapOn(c, width - 2 * margin, 50 * mm)
        instructions.drawOn(c, margin, height - 80 * mm)  # Moved closer to title (just below line)
        return height - 58 * mm - instructions.height - 10 * mm

    def draw_page_number(page_num, total_pages=None):
        """Draw page numbers at the bottom of the page"""
        c.setFont("Helvetica", 8)
        if total_pages:
            c.drawCentredString(width / 2, 10 * mm, f"Page {page_num} of {total_pages}")
        else:
            c.drawCentredString(width / 2, 10 * mm, f"Page {page_num}")

    def draw_mcq_bubbles(x, y, question):
        choices = [
            ('A', question.option_a),
            ('B', question.option_b),
            ('C', question.option_c),
            ('D', question.option_d),
        ]
        
        # Grid settings
        bubble_radius = 3 * mm
        column_width = 75 * mm  # Increased to allow space for bubble + text
        row_height = 12 * mm

        positions = [
            (0, 0),  # A: top-left
            (1, 0),  # B: top-right
            (0, 1),  # C: bottom-left
            (1, 1),  # D: bottom-right
        ]

        for i, (label, text) in enumerate(choices):
            col, row = positions[i]
            pos_x = x + (col * column_width)
            pos_y = y - (row * row_height)

            # Draw the bubble
            bubble_center_x = pos_x + bubble_radius
            bubble_center_y = pos_y + bubble_radius
            c.setFillColor(colors.white)
            c.setStrokeColor(colors.black)
            c.setLineWidth(0.5)
            c.circle(bubble_center_x, bubble_center_y, bubble_radius, stroke=1, fill=0)

            # Draw the label and text
            c.setFont("Helvetica", 10)
            c.setFillColor(colors.black)
            text_x = bubble_center_x + 7 * mm
            c.drawString(text_x, pos_y, f"{label}. {text}")

        return y - (2 * row_height)  # Moved outside the loop


    # Calculate total pages (estimate)
    total_pages = 1
    mcq_count = exam.MCQQuestions.count() if hasattr(exam, 'MCQQuestions') else 0
    coding_count = exam.CodingQuestions.count() if hasattr(exam, 'CodingQuestions') else 0
    
    # Rough estimation: 4 MCQs per page, 1 coding question per page
    total_pages += mcq_count // 4
    total_pages += coding_count
    
    # Begin the first page
    page_num = 1
    draw_header()
    y = draw_instructions()

    # Multiple Choice Questions Section
    if hasattr(exam, 'MCQQuestions') and exam.MCQQuestions.exists():
        mcq_heading = Paragraph("<b>Multiple Choice Questions</b>", heading_style)
        mcq_heading.wrapOn(c, width - 2 * margin, 20 * mm)
        mcq_heading.drawOn(c, margin, y)
        y -= mcq_heading.height + 10 * mm

        for index, question in enumerate(exam.MCQQuestions.all(), start=1):
            # Check if there's enough space for the question
            if y < 80 * mm:
                draw_page_number(page_num, total_pages)
                c.showPage()
                page_num += 1
                y = height - 30 * mm
                draw_header()
                y -= 40 * mm  # Adjust for header space

            # Question text with wrapping
            question_text = Paragraph(f"{index}. {question.question_text}", normal_style)
            available_width = width - 2 * margin
            question_text.wrapOn(c, available_width, 50 * mm)
            question_text.drawOn(c, margin, y)
            
            # Calculate height used by question text
            text_height = question_text.height
            y -= text_height + 8 * mm  # Move down after question text
            
            # Create a centered position for the bubble grid
            bubble_x = margin + 0 * mm  # Start position of the grid
            bubble_y = y
            
            # Draw answer options in 2x2 grid
            bubble_end_y = draw_mcq_bubbles(bubble_x, bubble_y, question)

            
            # Ensure we move down enough after the bubble grid
            y = bubble_end_y - 15 * mm  # Extra space after bubbles

    # Coding Questions Section
    if hasattr(exam, 'CodingQuestions') and exam.CodingQuestions.exists():
        # Start a new page for coding questions
        # if page_num > 1 or y < 150 * mm:
        #     draw_page_number(page_num, total_pages)
        #     c.showPage()
        #     page_num += 1
        #     y = height - 30 * mm
        #     draw_header()
        #     y -= 40 * mm  # Adjust for header space
        
        # coding_heading = Paragraph("<b>Coding Questions</b>", heading_style)
        # coding_heading.wrapOn(c, width - 2 * margin, 20 * mm)
        # coding_heading.drawOn(c, margin, y)
        # y -= coding_heading.height + 10 * mm
        
        for index, question in enumerate(exam.CodingQuestions.all(), start=1):
            if index > 0 or y < 150 * mm:
                draw_page_number(page_num, total_pages)
                c.showPage()
                page_num += 1
                y = height - 30 * mm
                # Use a custom title that includes the coding question info
                draw_header(f"{exam.title} - Code Question {index}: {question.title}")
                y -= 40 * mm  # Adjust for header space

            # Language information
            language = getattr(question, 'language', 'Python').capitalize()
            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(colors.black)
            c.drawString(margin, y, f"Language: {language}")
            y -= 8 * mm

            # Starter code (if available)
            if hasattr(question, 'starter_code') and question.starter_code:
                # Format the starter code with proper monospace font
                c.setFont("Courier", 9)
                code_lines = question.starter_code.split('\n')
                for line in code_lines:
                    c.drawString(margin, y, line)
                    y -= 5 * mm
                y -= 5 * mm  # Extra space after code

            # Answer section
            c.setFont("Helvetica-Bold", 10)
            c.drawString(margin, y, "Answer:")
            y -= 8 * mm

            # Draw lined answer space
            c.setLineWidth(0.3)
            line_spacing = 8 * mm
            num_lines = 8  # Increased number of lines for more answer space
            
            for i in range(num_lines):
                c.line(margin, y - i * line_spacing, width - margin, y - i * line_spacing)

            # Move down past the answer space
            y -= num_lines * line_spacing + 10 * mm

    # Save the final page
    draw_page_number(page_num, total_pages)
    c.save()
    return file_path