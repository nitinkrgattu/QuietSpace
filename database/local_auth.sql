-- ============================================
-- QuietSpace local authentication migration
-- Stores app users in Supabase Postgres without Supabase Auth.
-- Run this in the Supabase SQL Editor.
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.local_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Existing app rows may already point at Supabase Auth user IDs.
-- Create matching local_users rows first so old profiles/tasks/sessions keep working.
-- Migrated placeholder accounts use password: demo123456
DO $$
DECLARE
    default_password_hash TEXT := 'pbkdf2_sha256$260000$717569657473706163655f64656d6f5f31$cd39d06d00c78299f15025e8f46480aeb2040d2cb15526ca71e5fda5731303d1';
BEGIN
    INSERT INTO public.local_users (id, email, password_hash, name, created_at)
    SELECT
        p.id,
        COALESCE(NULLIF(p.email, ''), 'migrated-' || p.id::text || '@quietspace.local'),
        default_password_hash,
        COALESCE(NULLIF(p.name, ''), split_part(COALESCE(NULLIF(p.email, ''), 'Student'), '@', 1), 'Student'),
        COALESCE(p.created_at, NOW())
    FROM public.profiles p
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.local_users (id, email, password_hash, name)
    SELECT DISTINCT
        source.user_id,
        'migrated-' || source.user_id::text || '@quietspace.local',
        default_password_hash,
        'Migrated Student'
    FROM (
        SELECT user_id FROM public.tasks
        UNION
        SELECT user_id FROM public.focus_sessions
        UNION
        SELECT user_id FROM public.recommendations
    ) source
    WHERE source.user_id IS NOT NULL
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Move app data foreign keys from auth.users to local_users.
ALTER TABLE IF EXISTS public.profiles
    DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE IF EXISTS public.tasks
    DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

ALTER TABLE IF EXISTS public.focus_sessions
    DROP CONSTRAINT IF EXISTS focus_sessions_user_id_fkey;

ALTER TABLE IF EXISTS public.recommendations
    DROP CONSTRAINT IF EXISTS recommendations_user_id_fkey;

ALTER TABLE IF EXISTS public.profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES public.local_users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.tasks
    ADD CONSTRAINT tasks_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.local_users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.focus_sessions
    ADD CONSTRAINT focus_sessions_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.local_users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.recommendations
    ADD CONSTRAINT recommendations_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.local_users(id) ON DELETE CASCADE;

-- Supabase Auth signup trigger is no longer used by local auth.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
