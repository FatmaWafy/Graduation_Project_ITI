from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import os

class ChatbotQuestionsView(APIView):
    def get(self, request):
        user_role = request.user.role
        print('User Role:', user_role)
        try:
            with open(os.path.join('chatbot', f'{user_role}_questions.json'), 'r', encoding='utf-8') as f:
                data = json.load(f)
            print('Loaded Data:', data)
            return Response(data, status=status.HTTP_200_OK)
        except FileNotFoundError:
            return Response({'error': f'No questions found for role {user_role}'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)