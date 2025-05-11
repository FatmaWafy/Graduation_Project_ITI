import os
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project-id.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-service-role-key")
BUCKET_NAME = "media"

def upload_media(file, file_path: str) -> str:
    """Upload a file to Supabase Storage and return its public URL."""
    try:
        file_bytes = file.read()
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/pdf",  # Adjust for dynamic MIME types if needed
        }

        url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{file_path}"
        response = requests.put(url, headers=headers, data=file_bytes)

        if not response.ok:
            raise Exception(f"Upload failed: {response.status_code} - {response.text}")

        # Public URL
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{file_path}"
        return public_url

    except Exception as e:
        raise Exception(f"Error uploading to Supabase: {e}")


def delete_media(file_path: str) -> bool:
    """Delete a file from Supabase Storage."""
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
        }
        url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{file_path}"
        response = requests.delete(url, headers=headers)

        return response.status_code == 200
    except Exception as e:
        raise Exception(f"Error deleting from Supabase: {e}")
