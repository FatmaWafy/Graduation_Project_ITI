from django.db import models
# from tracks.models import Track
from users.models import Student
from django.utils.translation import gettext_lazy as _


class Exam(models.Model):
    title = models.CharField(max_length=255)
    # track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="exams")
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")

    def __str__(self):
        return self.title


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


# Coding Questions Model
class CodingQuestion(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    difficulty = models.CharField(
        max_length=20, 
        choices=DifficultyLevel.choices
    )

    starter_code = models.TextField()
    test_cases = models.JSONField()
    source = models.CharField(max_length=100)
    points = models.FloatField(default=1.0)


class Answer(models.Model):
    question = models.ForeignKey(MCQQuestion, on_delete=models.CASCADE, related_name="answers")
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class StudentExam(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="exams")
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="student_exams")
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(default=0.0)

    def calculate_score(self):
        total_points = sum(q.points for q in self.exam.mcq_questions.all()) + \
                    sum(q.points for q in self.exam.coding_questions.all())

        earned_points = 0

        for student_answer in self.answers.all():
            if student_answer.mcq_question:
                if student_answer.selected_answer and student_answer.selected_answer.is_correct:
                    earned_points += student_answer.mcq_question.points
            elif student_answer.coding_question:
                # TODO: Implement proper test case evaluation
                if student_answer.code_answer and student_answer.code_answer.strip() == student_answer.coding_question.test_cases.strip():
                    earned_points += student_answer.coding_question.points

        self.score = (earned_points / total_points) * 100 if total_points > 0 else 0
        self.save()


class StudentAnswer(models.Model):
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE, related_name="answers")
    
    mcq_question = models.ForeignKey(MCQQuestion, on_delete=models.CASCADE, blank=True, null=True)
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, blank=True, null=True)

    coding_question = models.ForeignKey(CodingQuestion, on_delete=models.CASCADE, blank=True, null=True)
    code_answer = models.TextField(blank=True, null=True)

    def __str__(self):
        question_text = self.mcq_question.question_text if self.mcq_question else self.coding_question.title
        return f"{self.student_exam.student.user.username} - {question_text}"
