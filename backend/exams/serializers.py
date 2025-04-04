from rest_framework import serializers
from .models import Exam,MCQQuestion, TemporaryExamInstance, StudentExamAnswer

class ExamSerializer(serializers.ModelSerializer):
    questions = serializers.PrimaryKeyRelatedField(
        queryset=MCQQuestion.objects.all(), 
        many=True, 
        required=False,
        source='MCQQuestions'  # This maps 'questions' in JSON to 'MCQQuestions' in model
    )
        
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