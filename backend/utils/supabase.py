# utils/supabase.py

from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_media(file, file_path):
    try:
        # نرفع الملف في المسار المحدد داخل الباكت media
        response = supabase.storage.from_('media').upload(file_path, file)
        return response
    except Exception as e:
        print("Upload Error:", e)
        return None
