from django.db import models
from tracks.models import Track
from users.models import Student


class Exam(models.Model):
    title = models.CharField(max_length=255)
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="exams")
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")  # مدة الامتحان بالدقائق

    def __str__(self):
        return self.title


class Question(models.Model):
    QUESTION_TYPES = [
        ('mcq', 'Multiple Choice'),
        ('code', 'Code Editor'),
    ]

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)

    # الإجابة الصحيحة لأسئلة الكود
    correct_answer = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.text


class Answer(models.Model):
    """ يستخدم فقط لأسئلة الـ MCQ """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class StudentExam(models.Model):
    """ يربط الطالب بالامتحان، ويحفظ النتيجة بعد التصحيح """
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="exams")
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="student_exams")
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(default=0.0)

    def calculate_score(self):
        correct_answers = 0
        total_questions = self.exam.questions.count()

        for student_answer in self.answers.all():
            if student_answer.question.question_type == 'mcq':
                if student_answer.selected_answer and student_answer.selected_answer.is_correct:
                    correct_answers += 1
            elif student_answer.question.question_type == 'code':
                if student_answer.code_answer and student_answer.code_answer.strip() == student_answer.question.correct_answer.strip():
                    correct_answers += 1

        self.score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        self.save()

    def __str__(self):
        return f"{self.student.user.username} - {self.exam.title}"


class StudentAnswer(models.Model):
    """ تخزين إجابات الطالب لكل سؤال سواء كان MCQ أو Code """
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    # MCQ
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, blank=True, null=True)

    # Code Editor
    code_answer = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.student_exam.student.user.username} - {self.question.text}"
