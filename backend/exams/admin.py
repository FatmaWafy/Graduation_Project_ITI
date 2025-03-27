from django.contrib import admin
from .models import Exam, Question, Answer, StudentExam, StudentAnswer
# Register your models here.
admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(StudentExam)
admin.site.register(StudentAnswer)