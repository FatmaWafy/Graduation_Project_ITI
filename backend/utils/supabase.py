from supabase import create_client, Client
from django.conf import settings

SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_media(file, file_path):
    try:
        print(f"Uploading file to path: {file_path}")
        # Read the file content as bytes
        file_content = file.read()
        response = supabase.storage.from_("labs").upload(file_path, file_content, {
            "content-type": "application/pdf"
        })
        print(f"Upload response: {response}")
        if response.get("error"):
            raise Exception(f"Upload failed: {response['error']['message']}")
        public_url = supabase.storage.from_("labs").get_public_url(file_path)
        print(f"Public URL: {public_url}")
        return public_url
    except Exception as e:
        print(f"Error in upload_media: {str(e)}")
        raise Exception(f"Error uploading: {str(e)}")

def delete_media(file_path):
    try:
        print(f"Deleting file at path: {file_path}")
        response = supabase.storage.from_("labs").remove([file_path])
        print(f"Delete response: {response}")
        if response.get("error"):
            raise Exception(f"Delete failed: {response['error']['message']}")
    except Exception as e:
        print(f"Error in delete_media: {str(e)}")
        raise Exception(f"Error deleting: {str(e)}")