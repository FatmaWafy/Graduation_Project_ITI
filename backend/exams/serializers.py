from rest_framework import serializers
from .models import CodingQuestion, Exam,MCQQuestion, TemporaryExamInstance, StudentExamAnswer, CodingTestCase

class ExamSerializer(serializers.ModelSerializer):
    mcq_questions = serializers.PrimaryKeyRelatedField(
        queryset=MCQQuestion.objects.all(),
        many=True,
        required=False
    )
    coding_questions = serializers.PrimaryKeyRelatedField(
        queryset=CodingQuestion.objects.all(),
        many=True,
        required=False
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
        fields = "__all__"
        
class CodingTestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingTestCase
        fields = "__all__"
        
class CodingQuestionSerializer(serializers.ModelSerializer):
    test_cases = CodingTestCaseSerializer(many=True, read_only=True)
    
    class Meta:
        model = CodingQuestion
        fields = "__all__"  
