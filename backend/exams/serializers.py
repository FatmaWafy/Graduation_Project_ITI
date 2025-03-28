from rest_framework import serializers
from .models import Exam,StudentExam, StudentAnswer,MCQQuestion, CodingQuestion, TemporaryExamInstance,Answer,StudentExamAnswerSerializer

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'


class TempExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemporaryExamInstance
        fields = "__all__"

class MCQQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQQuestion
        fields = "__all__"  # Include all fields

# class CodingQuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CodingQuestion
#         fields = "__all__"

class StudentExamAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentExamAnswer
        fields = ['student', 'exam_instance', 'score', 'submitted_at']
