from rest_framework import serializers
from .models import CheatingLog, CodingQuestion, Exam,MCQQuestion, TemporaryExamInstance, StudentExamAnswer, CodingTestCase, Course

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
    Course = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        many=True,
        required=False
    )
    class Meta:
        model = Exam
        fields = '__all__'


class TempExamSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    total_questions = serializers.SerializerMethodField()
    instructor = serializers.StringRelatedField(read_only=True)  # أو استخدمي user.username مثلاً لو عايزة تظهر اسمه


    class Meta:
        model = TemporaryExamInstance
        fields = "__all__"
        
    def get_total_questions(self, obj):
        # Calculate the total questions (MCQ + Coding)
        total_mcq = obj.exam.MCQQuestions.count()
        total_coding = obj.exam.CodingQuestions.count()
        return total_mcq + total_coding

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

class CheatingLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # أو استخدمي user.username مثلاً لو عايزة تظهر اسمه

    class Meta:
        model = CheatingLog
        fields = ['exam_id', 'reason', 'timestamp', 'user']


# from .models import CheatingLog

# class CheatingLogSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField(read_only=True)  # أو استخدمي user.username مثلاً لو عايزة تظهر اسمه

#     class Meta:
#         model = CheatingLog
#         fields = ['exam_id', 'reason', 'timestamp', 'user']
