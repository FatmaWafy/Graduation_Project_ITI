from rest_framework import serializers
from .models import Note, PredefinedNotification
from users.models import Instructor, Student

class NotificationSerializer(serializers.ModelSerializer):
    instructor_id = serializers.IntegerField(source="instructor.id",write_only=True)
    student_id = serializers.IntegerField(source="student.id",write_only=True) 

    class Meta:
        model = Note
        fields = ['id', 'message', 'created_at', 'instructor_id', 'student_id', 'instructor', 'student']

    # def create(self, validated_data):
    #     instructor_id = validated_data.pop('instructor_id')
    #     student_id = validated_data.pop('student_id')

        # try:
        #     instructor = Instructor.objects.get(id=instructor_id)
        # except Instructor.DoesNotExist:
        #     raise serializers.ValidationError({"error": f"Instructor with id {instructor_id} not found!"})

        # try:
        #     student = Student.objects.get(id=student_id)
        # except Student.DoesNotExist:
        #     raise serializers.ValidationError({"error": f"Student with id {student_id} not found!"})

        # note = Note.objects.create(instructor=instructor, student=student, **validated_data)
        # return note

# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = '__all__'

class PredefinedNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedNotification
        fields = ['id', 'message']
