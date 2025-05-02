# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Instructor
from django.utils.crypto import get_random_string

@receiver(post_save, sender=Instructor)
def send_welcome_email(sender, instance, created, **kwargs):
    print(f"Signal triggered for instructor: {instance.user.username}, created: {created}")
    if created:  # Only run when a new instructor is created
        # Generate a random password
        password = get_random_string(length=12)
        instance.user.set_password(password)
        instance.user.save()

        email_subject = "Welcome to the Platform"
        email_message = f"""
Hi {instance.user.username},

You have been registered as an instructor.

Email: {instance.user.email}
Password: {password}

Please complete your profile and change your password by visiting:
http://localhost:3000/signup

Best regards,
Your Admin Team
"""
        try:
            send_mail(
                subject=email_subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.user.email],
                fail_silently=False,
            )
            print(f"Welcome email sent to {instance.user.email}")
        except Exception as e:
            print(f"Failed to send email: {str(e)}")