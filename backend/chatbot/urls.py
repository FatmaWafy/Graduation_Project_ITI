from django.urls import path
from .views import ChatbotQuestionsView

urlpatterns = [
    path('questions/', ChatbotQuestionsView.as_view(), name='chatbot-questions'),
]