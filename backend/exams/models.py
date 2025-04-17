from venv import logger
from django.db import models
from users.models import Instructor, Track
from users.models import Student , Branch, Course
from django.utils.translation import gettext_lazy as _
import json
import zlib
from django.contrib.auth import get_user_model
User = get_user_model()
from django.utils.timezone import now

# Exam Model
class Exam(models.Model): ### plus course name
    title = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="exams", null=True, blank=True)  
    MCQQuestions = models.ManyToManyField("MCQQuestion", blank=True)
    CodingQuestions = models.ManyToManyField("CodingQuestion", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")

    def __str__(self):
        return self.title
    
# Temporary Exam Instance Model
class TemporaryExamInstance(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="instances")
    track = models.ForeignKey(Track, on_delete=models.CASCADE , blank=True, null=True)  
    students = models.ManyToManyField(Student, blank=True) 
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name="exam_instances")  
    instructor_id = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, db_column='instructor_id')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    def __str__(self):
        return f"{self.exam.title} - {self.start_datetime}"
    

# Enum for Difficulty Levels
class DifficultyLevel(models.TextChoices):
    EASY = "Easy", _("Easy")
    MEDIUM = "Medium", _("Medium")
    HARD = "Hard", _("Hard")

# Enum for MCQ Options
class MCQOptions(models.TextChoices):
    A = "A", _("Option A")
    B = "B", _("Option B")
    C = "C", _("Option C")
    D = "D", _("Option D")

class language(models.TextChoices):
    PYTHON = "Python", _("Python")
    JAVASCRIPT = "JavaScript", _("JavaScript")
    JAVA = "Java", _("Java")
    SQL = "SQL", _("SQL")
    


# MCQ Model
class MCQQuestion(models.Model):
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255, null=True, blank=True)
    option_d = models.CharField(max_length=255, null=True, blank=True)
    
    correct_option = models.CharField(
        max_length=1, 
        choices=MCQOptions.choices
    )
    
    difficulty = models.CharField(
        max_length=20, 
        choices=DifficultyLevel.choices
    )
    language = models.CharField(
        max_length=20, 
        choices=language.choices
    )
    source = models.CharField(max_length=100)
    points = models.FloatField(default=1.0)



class StudentExamAnswer(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="exam_answers")
    exam_instance = models.ForeignKey(TemporaryExamInstance, on_delete=models.CASCADE, related_name="student_answers")

    compressed_answers = models.BinaryField()
    score = models.FloatField(default=0.0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def set_answers(self, answers_dict):
        json_data = json.dumps(answers_dict).encode('utf-8')
        self.compressed_answers = zlib.compress(json_data)

    def get_answers(self):
        if self.compressed_answers:
            json_data = zlib.decompress(self.compressed_answers).decode('utf-8')
            return json.loads(json_data)
        return {}

    def calculate_score(self):
        answers = self.get_answers()
        total_score = 0

        mcq_answers = answers.get("mcq_answers", {})
        mcq_questions = MCQQuestion.objects.filter(id__in=mcq_answers.keys())

        for mcq in mcq_questions:
            if mcq_answers.get(str(mcq.id)) == mcq.correct_option:
                total_score += mcq.points

        return total_score

    def submit_exam(self, answers_dict):
        print("Received answers_dict:", answers_dict)

        try:
            self.set_answers(answers_dict)

            total_score = 0

            # Score MCQs
            mcq_answers = answers_dict.get("mcq_answers", {})
            for question_id_str, selected_option in mcq_answers.items():
                try:
                    question_id = int(question_id_str)
                    question = MCQQuestion.objects.get(id=question_id)
                    if question.correct_option == selected_option:
                        total_score += question.points
                except MCQQuestion.DoesNotExist:
                    continue

            # Score coding questions
            code_results = answers_dict.get("code_results", [])
            for result in code_results:
                question_id = result.get("question_id")
                test_results = result.get("test_results", [])
                
                # Check if all test cases passed
                all_passed = all(test.get("isSuccess", False) for test in test_results)

                if all_passed:
                    try:
                        question = CodingQuestion.objects.get(id=question_id)
                        total_score += question.points
                    except CodingQuestion.DoesNotExist:
                        continue

            self.score = total_score
            self.save()

            return {"message": "Exam submitted successfully."}

        except Exception as e:
            return {"error": str(e)}
        print("Received answers_dict:", answers_dict)

        try:
            self.set_answers(answers_dict)

            total_score = 0

            # Score MCQs
            mcq_answers = answers_dict.get("mcq_answers", {})
            for question_id_str, selected_option in mcq_answers.items():
                try:
                    question_id = int(question_id_str)
                    question = MCQQuestion.objects.get(id=question_id)
                    if question.correct_option == selected_option:
                        total_score += question.points
                except MCQQuestion.DoesNotExist:
                    continue

            # Score coding questions
            code_results = answers_dict.get("code_results", [])
            for result in code_results:
                question_id = result.get("question_id")
                test_results = result.get("test_results", [])
                
                # Check if all test cases passed
                all_passed = all(test.get("isSuccess", False) for test in test_results)

                if all_passed:
                    try:
                        question = CodingQuestion.objects.get(id=question_id)
                        total_score += question.points
                    except CodingQuestion.DoesNotExist:
                        continue

            self.score = total_score
            self.save()

            return {"message": "Exam submitted successfully."}

        except Exception as e:
            return {"error": str(e)}
class CodingQuestion(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DifficultyLevel.choices)
    starter_code = models.TextField(default="None")
    source = models.CharField(max_length=100)
    points = models.FloatField(default=1.0)
    tags = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    language = models.CharField(
        max_length=20, 
        choices=language.choices
    )    
    def __str__(self):
        return f"{self.title} ({self.difficulty})({self.language})"

class CodingTestCase(models.Model):
    question = models.ForeignKey(CodingQuestion, related_name='test_cases', on_delete=models.CASCADE)
    input_data = models.TextField()
    expected_output = models.TextField()
    function_name = models.CharField(
        max_length=100,
        blank=True,  # Allows empty for single-function questions
        default="",  # Empty default
        help_text="Name of the function to test (leave blank for single-function questions)"
    )
    def __str__(self):
        return f"Test case for {self.question.title}"

class CheatingLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam_id = models.CharField(max_length=100)
    reason = models.TextField()
    timestamp = models.DateTimeField(blank=True, null=True)