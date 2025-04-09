from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
import os
from .models import Lab
from .serializers import LabSerializer
from users.models import Track, Student


class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If user is instructor, show only their labs
        if user.role == 'instructor':
            return Lab.objects.filter(instructor=user)
        # If user is student, show labs for their track
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
            # Get the file from the request
            file = self.request.FILES.get('file')
            if not file:
                raise serializers.ValidationError({"file": "No file was submitted"})

            # Calculate file size
            size_bytes = file.size
            if size_bytes < 1024:
                size_str = f"{size_bytes} B"
            elif size_bytes < 1024 * 1024:
                size_str = f"{size_bytes / 1024:.1f} KB"
            else:
                size_str = f"{size_bytes / (1024 * 1024):.1f} MB"

            # Check if track exists
            track_id = self.request.data.get('track')
            if not track_id:
                raise serializers.ValidationError({"track": "Track ID is required"})

            try:
                track = Track.objects.get(id=track_id)
            except Track.DoesNotExist:
                raise serializers.ValidationError({"track": f"Track with ID {track_id} does not exist"})

            # Save the lab
            serializer.save(
                instructor=self.request.user,
                size=size_str,
                track=track
            )
        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        try:
            lab = self.get_object()
            file_path = lab.file.path

            if os.path.exists(file_path):
                response = FileResponse(open(file_path, 'rb'))
                response['Content-Disposition'] = f'attachment; filename="{lab.name}"'
                return response

            return Response(
                {"error": "File not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred while downloading the file: {str(e)}"},
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