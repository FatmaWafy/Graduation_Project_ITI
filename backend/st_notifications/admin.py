from django.contrib import admin
from .models import Note, PredefinedNotification

admin.site.register(Note)
admin.site.register(PredefinedNotification)
