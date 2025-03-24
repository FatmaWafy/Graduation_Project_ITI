from django.contrib import admin
from .models import Student, Note, PredefinedNotification

admin.site.register(Student)
admin.site.register(Note)
admin.site.register(PredefinedNotification)
