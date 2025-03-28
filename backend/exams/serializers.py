from rest_framework import serializers
from .models import Exam,StudentExam, StudentAnswer,MCQQuestion, CodingQuestion, TemporaryExamInstance,Answer

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'


class TempExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemporaryExamInstance
        fields = "__all__"

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class StudentExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentExam
        fields = '__all__'

class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'

class MCQQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQQuestion
        fields = "__all__"  # Include all fields

class CodingQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingQuestion
        fields = "__all__"
