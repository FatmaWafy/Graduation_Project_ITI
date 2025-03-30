import requests
from django.core.management.base import BaseCommand
from exams.models import MCQQuestion
from exams.utils import API_URL  

class Command(BaseCommand):
    help = "Fetches questions from an external API and saves them in the database."

    def handle(self, *args, **kwargs):
        self.fetch_questions_from_api()

    def fetch_questions_from_api(self):
        """ Fetches questions from API and only saves valid ones. """
        try:
            response = requests.get(API_URL)
            response.raise_for_status()  # Raises error for bad responses
            data = response.json()
            
            for q in data.get("questions", []):
                if "correct_option" not in q or not q["correct_option"]:  # If missing or empty, skip
                    self.stdout.write(self.style.WARNING(f"Skipping question due to missing correct answer: {q}"))
                    continue  # Move to the next question

                # Create and save the question
                MCQQuestion.objects.create(
                    question_text=q.get("question_text", "Default Question"),
                    option_a=q.get("option_a", "A"),
                    option_b=q.get("option_b", "B"),
                    option_c=q.get("option_c", ""),
                    option_d=q.get("option_d", ""),
                    correct_option=q["correct_option"],  # Safe because we checked it exists
                    points=q.get("points", 1.0)
                )

            self.stdout.write(self.style.SUCCESS("Successfully fetched and saved questions."))

        except requests.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Error fetching questions: {e}"))
