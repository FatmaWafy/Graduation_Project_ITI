from supabase import create_client, Client
from django.conf import settings

# Initialize Supabase client
SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_media(file, file_path):
    """Upload a file to Supabase Storage and return the public URL."""
    try:
        # Upload the file to Supabase Storage
        response = supabase.storage.from_("labs").upload(file_path, file)
        if response.status_code != 200:  # Check for successful upload
            raise Exception(f"Upload failed: {response.json().get('error', 'Unknown error')}")

        # Get the public URL
        public_url = supabase.storage.from_("labs").get_public_url(file_path)
        return public_url
    except Exception as e:
        raise Exception(f"Error uploading to Supabase: {str(e)}")

def delete_media(file_path):
    """Delete a file from Supabase Storage."""
    try:
        response = supabase.storage.from_("labs").remove([file_path])
        if response.status_code != 200:  # Check for successful deletion
            raise Exception(f"Delete failed: {response.json().get('error', 'Unknown error')}")
    except Exception as e:
        raise Exception(f"Error deleting from Supabase: {str(e)}")