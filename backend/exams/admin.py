from django.contrib import admin
from .models import Exam, MCQQuestion, TemporaryExamInstance, StudentExamAnswer
# Register your models here.
admin.site.register(Exam)
admin.site.register(MCQQuestion)
admin.site.register(TemporaryExamInstance)
admin.site.register(StudentExamAnswer)