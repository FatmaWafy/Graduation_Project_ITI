from django.db import models
from users.models import User, Track

# In your labs/models.py file
def lab_file_path(instance, filename):
    """Generate file path for new lab file"""
    # Generate path: media/labs/track_id/filename
    return f'labs/{instance.track}/{filename}'

class Lab(models.Model):
    name = models.CharField(max_length=255)
    # file = models.FileField(upload_to='labs/')
    description = models.TextField(blank=True, null=True)
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='labs')
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_labs')
    created_at = models.DateTimeField(auto_now_add=True)
    size = models.CharField(max_length=20, blank=True, null=True)  # Store file size as string (e.g., "2.4 MB")
    file = models.FileField(upload_to=lab_file_path)
    submission_link = models.URLField(blank=True, null=True)
    def __str__(self):
        return self.name