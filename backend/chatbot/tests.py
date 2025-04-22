from django.db import models

class ChatbotQuestion(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    question_text = models.CharField(max_length=255)
    answer_text = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='follow_ups')
    
    class Meta:
        ordering = ['id']
    
    def __str__(self):
        return f"{self.question_text} ({self.role})"