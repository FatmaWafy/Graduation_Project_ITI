from django.core.management.base import BaseCommand
from django.utils.timezone import now, timedelta
from st_notifications.models import Note

class Command(BaseCommand):
    help = "Delete notes older than a certain period"

    def handle(self, *args, **kwargs):
        days_to_keep = 2
        threshold_date = now() - timedelta(days=days_to_keep)

        expired_notes = Note.objects.filter(created_at__lte=threshold_date)
        count = expired_notes.count()
        expired_notes.delete()

        self.stdout.write(self.style.SUCCESS(f"Deleted {count} expired notes."))




# /home/sarah/PythonFullStack/Graduation_Project_ITI/venv
# /home/sarah/PythonFullStack/Graduation_Project_ITI/backend
# * * * * * /home/sarah/PythonFullStack/Graduation_Project_ITI/venv/bin/python /home/sarah/PythonFullStack/Graduation_Project_ITI/backend/manage.py delete_old_notes
