from django.db import models
from users.models import Track
from users.models import Student
from django.utils.translation import gettext_lazy as _
import json
import zlib
from django.contrib.auth import get_user_model

# Exam Model
class Exam(models.Model):
    title = models.CharField(max_length=255)
    MCQQuestions = models.ManyToManyField("MCQQuestion", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")

    def __str__(self):
        return self.title
    
# Temporary Exam Instance Model
class TemporaryExamInstance(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="instances")
    track = models.ForeignKey(Track, on_delete=models.CASCADE , blank=True, null=True)    
    students = models.ManyToManyField(Student, blank=True) 
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

    source = models.CharField(max_length=100)
    points = models.FloatField(default=1.0)


# # Coding Questions Model
# class CodingQuestion(models.Model):
#     title = models.CharField(max_length=255)
#     description = models.TextField()
    
#     difficulty = models.CharField(
#         max_length=20, 
#         choices=DifficultyLevel.choices
#     )

#     starter_code = models.TextField(default="None")
#     test_cases = models.JSONField()
#     source = models.CharField(max_length=100)
#     points = models.FloatField(default=1.0)


User = get_user_model()
from django.utils.timezone import now

class StudentExamAnswer(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="exam_answers")
    exam_instance = models.ForeignKey(TemporaryExamInstance, on_delete=models.CASCADE, related_name="student_answers")
    
    compressed_answers = models.BinaryField()  # Compressed MCQ answers
    score = models.FloatField(default=0.0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def set_answers(self, answers_dict):
        """
        Convert JSON to bytes and compress before storing
        """
        json_data = json.dumps(answers_dict).encode('utf-8')
        self.compressed_answers = zlib.compress(json_data)

    def get_answers(self):
        """
        Extract stored answers and return as JSON
        """
        if self.compressed_answers:
            json_data = zlib.decompress(self.compressed_answers).decode('utf-8')
            return json.loads(json_data)
        return {}

    def calculate_score(self):
        """
        Grade only MCQ questions and calculate the score
        """
        answers = self.get_answers()
        total_score = 0

        mcq_answers = answers.get("mcq_answers", {})
        mcq_questions = MCQQuestion.objects.filter(id__in=mcq_answers.keys())

        for mcq in mcq_questions:
            if mcq_answers.get(str(mcq.id)) == mcq.correct_option:
                total_score += mcq.points

        self.score = total_score
        self.save()

    def submit_exam(self, answers_dict):
        """
        Handle exam submission with time validation.
        """
        # التحقق إذا كان الامتحان قد انتهى
        if now() > self.exam_instance.end_datetime:
            return {"error": "Time is up! You can't submit this exam."}

        # حفظ الإجابات إذا لم ينتهِ الوقت
        self.set_answers(answers_dict)
        self.calculate_score()
        return {"message": "Exam submitted successfully.", "score": self.score}


class CheatingLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam_id = models.CharField(max_length=100)
    reason = models.TextField()
    timestamp = models.DateTimeField()
