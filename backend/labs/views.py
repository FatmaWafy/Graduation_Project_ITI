# from rest_framework import viewsets, status, serializers
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from rest_framework.permissions import IsAuthenticated
# from django.http import FileResponse
# import os
# from .models import Lab
# from .serializers import LabSerializer
# from users.models import Track, Student


# class LabViewSet(viewsets.ModelViewSet):
#     queryset = Lab.objects.all()
#     serializer_class = LabSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         # If user is instructor, show only their labs
#         if user.role == 'instructor':
#             return Lab.objects.filter(instructor=user)
#         # If user is student, show labs for their track
#         elif user.role == 'student':
#             try:
#                 student = Student.objects.get(user=user)
#                 if student.track:
#                     return Lab.objects.filter(track=student.track)
#             except Student.DoesNotExist:
#                 return Lab.objects.none()
#         return Lab.objects.none()

#     def perform_create(self, serializer):
#         try:
#             # Get the file from the request
#             file = self.request.FILES.get('file')
#             if not file:
#                 raise serializers.ValidationError({"file": "No file was submitted"})

#             # Calculate file size
#             size_bytes = file.size
#             if size_bytes < 1024:
#                 size_str = f"{size_bytes} B"
#             elif size_bytes < 1024 * 1024:
#                 size_str = f"{size_bytes / 1024:.1f} KB"
#             else:
#                 size_str = f"{size_bytes / (1024 * 1024):.1f} MB"

#             # Check if track exists
#             track_id = self.request.data.get('track')
#             if not track_id:
#                 raise serializers.ValidationError({"track": "Track ID is required"})

#             try:
#                 track = Track.objects.get(id=track_id)
#             except Track.DoesNotExist:
#                 raise serializers.ValidationError({"track": f"Track with ID {track_id} does not exist"})

#             # Save the lab
#             serializer.save(
#                 instructor=self.request.user,
#                 size=size_str,
#                 track=track,
#                 submission_link=self.request.data.get('submission_link')
#             )
#         except Exception as e:
#             raise serializers.ValidationError({"error": str(e)})

#     @action(detail=True, methods=['get'])
#     def download(self, request, pk=None):
#         try:
#             lab = self.get_object()
#             file_path = lab.file.path

#             if os.path.exists(file_path):
#                 response = FileResponse(open(file_path, 'rb'))
#                 response['Content-Disposition'] = f'attachment; filename="{lab.name}"'
#                 return response

#             return Response(
#                 {"error": "File not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except Exception as e:
#             return Response(
#                 {"error": f"An error occurred while downloading the file: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#     @action(detail=False, methods=['get'])
#     def by_track(self, request):
#         track_id = request.query_params.get('track_id')

#         if not track_id:
#             return Response(
#                 {"error": "Track ID is required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             track = Track.objects.get(id=track_id)
#             labs = Lab.objects.filter(track=track)
#             serializer = self.get_serializer(labs, many=True)
#             return Response(serializer.data)
#         except Track.DoesNotExist:
#             return Response(
#                 {"error": "Track not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )
            
# # labs/views.py

# from django.http import JsonResponse
# from utils.supabase import upload_media

# def upload_lab_file(request):
#     if request.method == 'POST':
#         file = request.FILES['file']  # تأكدي إن اسمه "file" في الفورم أو الريكوست
#         track = request.POST.get('track')  # التراك بييجي من الفورم أو الريكوست

#         if not track:
#             return JsonResponse({'error': 'Track is required'}, status=400)

#         file_path = f"labs/{track}/{file.name}"  # المسار حسب التراك واسم الملف

#         response = upload_media(file, file_path)

#         if response:
#             url = f"https://xxx.supabase.co/storage/v1/object/public/media/{file_path}"
#             return JsonResponse({'url': url})
#         return JsonResponse({'error': 'Upload failed'}, status=400)


from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Lab, Submission
from .serializers import LabSerializer
from users.models import Track, Student
from utils.supabase import upload_media, delete_media

class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'instructor':
            return Lab.objects.filter(instructor=user)
        elif user.role == 'student':
            try:
                student = Student.objects.get(user=user)
                if student.track:
                    return Lab.objects.filter(track=student.track)
            except Student.DoesNotExist:
                return Lab.objects.none()
        return Lab.objects.none()

    def perform_create(self, serializer):
        try:
            file = self.request.FILES.get('file')
            if not file:
                raise serializers.ValidationError({"file": "No file was submitted"})

            size_bytes = file.size
            size_str = f"{size_bytes / (1024 * 1024):.1f} MB" if size_bytes >= 1024 * 1024 else f"{size_bytes / 1024:.1f} KB" if size_bytes >= 1024 else f"{size_bytes} B"

            track_id = self.request.data.get('track')
            if not track_id:
                raise serializers.ValidationError({"track": "Track ID is required"})

            track = Track.objects.get(id=track_id)
            file_path = f"labs/{track.id}/{file.name}"
            file.seek(0)
            public_url = upload_media(file, file_path)

            serializer.save(
                instructor=self.request.user,
                size=size_str,
                track=track,
                file=public_url,
                submission_link=self.request.data.get('submission_link')
            )
        except Exception as e:
            print(f"Error in perform_create: {str(e)}")
            raise serializers.ValidationError({"error": str(e), "details": "Failed to create lab"})

    def perform_destroy(self, instance):
        try:
            file_path = f"labs/{instance.track.id}/{instance.name}"
            delete_media(file_path)
            instance.delete()
        except Exception as e:
            raise serializers.ValidationError({"error": f"Failed to delete file from storage: {str(e)}"})

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        try:
            lab = self.get_object()
            if not lab.file:
                return Response(
                    {"error": "File URL not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response({"url": lab.file})
        except Exception as e:
            return Response(
                {"error": f"An error occurred while fetching the file URL: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def by_track(self, request):
        track_id = request.query_params.get('track_id')
        if not track_id:
            return Response(
                {"error": "Track ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            track = Track.objects.get(id=track_id)
            labs = Lab.objects.filter(track=track)
            serializer = self.get_serializer(labs, many=True)
            return Response(serializer.data)
        except Track.DoesNotExist:
            return Response(
                {"error": "Track not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        try:
            lab = self.get_object()
            submission_link = request.data.get('submission_link', lab.submission_link)

            submission, created = Submission.objects.get_or_create(
                student=request.user,
                lab=lab,
                defaults={'submission_link': submission_link}
            )

            if not created:
                return Response(
                    {"error": "You have already submitted this lab"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response({"message": "Submission recorded successfully"})
        except Lab.DoesNotExist:
            return Response(
                {"error": "Lab not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )