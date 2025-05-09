# from rest_framework import serializers

# from users.models import Track
# from .models import Lab

# class LabSerializer(serializers.ModelSerializer):
#     instructor_name = serializers.SerializerMethodField(read_only=True)
#     track_name = serializers.SerializerMethodField(read_only=True)
    
#     class Meta:
#         model = Lab
#         fields = ['id', 'name', 'file', 'description', 'track', 'track_name', 
#                   'instructor', 'instructor_name', 'created_at', 'size' , 'submission_link']
#         read_only_fields = ['instructor', 'created_at', 'size' ]
    
#     def get_instructor_name(self, obj):
#         return obj.instructor.username if obj.instructor else None
    
#     def get_track_name(self, obj):
#         return obj.track.name if obj.track else None
        
#     def validate_file(self, value):
#         # Check file type if needed
#         if not value.name.endswith('.pdf'):
#             raise serializers.ValidationError("Only PDF files are allowed.")
        
#         # Check file size if needed (e.g., 10MB limit)
#         if value.size > 10 * 1024 * 1024:
#             raise serializers.ValidationError("File size cannot exceed 10MB.")
            
#         return value
        
#     def validate_track(self, value):
#         # Ensure track exists
#         if not Track.objects.filter(id=value.id).exists():
#             raise serializers.ValidationError(f"Track with ID {value.id} does not exist.")
#         return value

from rest_framework import serializers
from users.models import Track
from .models import Lab

class LabSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField(read_only=True)
    track_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Lab
        fields = ['id', 'name', 'file', 'description', 'track', 'track_name', 
                  'instructor', 'instructor_name', 'created_at', 'size', 'submission_link']
        read_only_fields = ['instructor', 'created_at', 'size']

    def get_instructor_name(self, obj):
        return obj.instructor.username if obj.instructor else None
    
    def get_track_name(self, obj):
        return obj.track.name if obj.track else None
        
    def validate(self, data):
        # Validate file (before upload in views.py)
        file = self.context['request'].FILES.get('file')
        if not file:
            raise serializers.ValidationError({"file": "No file was submitted"})
        
        # Check file type
        if not file.name.endswith('.pdf'):
            raise serializers.ValidationError({"file": "Only PDF files are allowed"})
        
        # Check file size (10MB limit)
        if file.size > 10 * 1024 * 1024:
            raise serializers.ValidationError({"file": "File size cannot exceed 10MB"})
            
        # Validate track
        track = data.get('track')
        if not track:
            raise serializers.ValidationError({"track": "Track is required"})
        
        if not Track.objects.filter(id=track.id).exists():
            raise serializers.ValidationError({"track": f"Track with ID {track.id} does not exist"})
        
        return data