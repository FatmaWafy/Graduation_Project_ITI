from rest_framework import serializers
from users.models import Track
from .models import Lab

# class LabSerializer(serializers.ModelSerializer):
#     instructor_name = serializers.SerializerMethodField(read_only=True)
#     track_name = serializers.SerializerMethodField(read_only=True)
    
#     class Meta:
#         model = Lab
#         fields = ['id', 'name', 'file', 'description', 'track', 'track_name', 
#                   'instructor', 'instructor_name', 'created_at', 'size', 'submission_link']
#         read_only_fields = ['instructor', 'created_at', 'size']

#     def get_instructor_name(self, obj):
#         return obj.instructor.username if obj.instructor else None
    
#     def get_track_name(self, obj):
#         return obj.track.name if obj.track else None
        
#     def validate(self, data):
#         # Validate file (before upload in views.py)
#         file = self.context['request'].FILES.get('file')
#         if not file:
#             raise serializers.ValidationError({"file": "No file was submitted"})
        
#         # Check file type
#         if not file.name.endswith('.pdf'):
#             raise serializers.ValidationError({"file": "Only PDF files are allowed"})
        
#         # Check file size (10MB limit)
#         if file.size > 10 * 1024 * 1024:
#             raise serializers.ValidationError({"file": "File size cannot exceed 10MB"})
            
#         # Validate track
#         track = data.get('track')
#         if not track:
#             raise serializers.ValidationError({"track": "Track is required"})
        
#         if not Track.objects.filter(id=track.id).exists():
#             raise serializers.ValidationError({"track": f"Track with ID {track.id} does not exist"})
        
#         return data

class LabSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField(read_only=True)
    track_name = serializers.SerializerMethodField(read_only=True)
    is_submitted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Lab
        fields = [
            'id', 'name', 'file', 'description', 'track', 'track_name',
            'instructor', 'instructor_name', 'created_at', 'size', 'submission_link',
            'is_submitted'
        ]
        read_only_fields = ['instructor', 'created_at', 'size', 'file']

    def get_instructor_name(self, obj):
        return obj.instructor.username if obj.instructor else None

    def get_track_name(self, obj):
        return obj.track.name if obj.track else None

    def get_is_submitted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Submission.objects.filter(student=request.user, lab=obj).exists()
        return False

    def validate(self, data):
        request = self.context.get('request')
        file = request.FILES.get('file') if request else None

        if not file:
            raise serializers.ValidationError({"file": "No file was submitted"})

        if not file.name.endswith('.pdf'):
            raise serializers.ValidationError({"file": "Only PDF files are allowed"})
        if file.size > 10 * 1024 * 1024:
            raise serializers.ValidationError({"file": "File size cannot exceed 10MB"})

        track = data.get('track')
        if not track:
            raise serializers.ValidationError({"track": "Track is required"})

        if not Track.objects.filter(id=track.id).exists():
            raise serializers.ValidationError({"track": f"Track with ID {track.id} does not exist"})

        return data