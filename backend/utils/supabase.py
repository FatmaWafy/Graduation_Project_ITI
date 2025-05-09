from supabase import create_client, Client
import os

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_media(file, file_path: str) -> str:
    """Upload a file to Supabase Storage and return its public URL."""
    try:
        # Upload file to Supabase Storage
        bucket_name = "media"
        response = supabase.storage.from_(bucket_name).upload(file_path, file, {"content-type": "application/pdf"})
        
        # Check if upload was successful
        if response.status_code != 200:
            raise Exception(f"Failed to upload file: {response.json().get('error', 'Unknown error')}")

        # Generate public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        return public_url
    except Exception as e:
        raise Exception(f"Error uploading to Supabase: {str(e)}")

def delete_media(file_path: str) -> bool:
    """Delete a file from Supabase Storage."""
    try:
        bucket_name = "media"
        response = supabase.storage.from_(bucket_name).remove([file_path])
        return response.status_code == 200
    except Exception as e:
        raise Exception(f"Error deleting from Supabase: {str(e)}")