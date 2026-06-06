# ============================================
# supabase_client.py
# Supabase client initialisation
# Uses service role key for backend operations
# ============================================

from supabase import create_client, Client
from app.config import settings

def get_supabase() -> Client:
    """Return an authenticated Supabase client using the service role key."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables."
        )
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Singleton client instance
supabase: Client = get_supabase()
