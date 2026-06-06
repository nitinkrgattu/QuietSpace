-- ============================================
-- QuietSpace Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Extends Supabase auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email               TEXT NOT NULL,
    name                TEXT,
    daily_goal_hours    NUMERIC(4,1) NOT NULL DEFAULT 4.0,
    weekly_goal_hours   NUMERIC(5,1) NOT NULL DEFAULT 20.0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLE: tasks
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text         TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
    subject      TEXT NOT NULL DEFAULT 'General' CHECK (char_length(subject) <= 100),
    priority     TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    completed    BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLE: focus_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 480),
    phase            TEXT NOT NULL DEFAULT 'focus' CHECK (phase IN ('focus', 'break')),
    status           TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'abandoned')),
    started_at       TIMESTAMPTZ NOT NULL,
    ended_at         TIMESTAMPTZ NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABLE: recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS public.recommendations (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type         TEXT NOT NULL CHECK (type IN ('focus', 'schedule', 'break', 'subject', 'environment')),
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    tag          TEXT,
    icon         TEXT,
    color        TEXT,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id          ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed        ON public.tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id       ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at    ON public.focus_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status        ON public.focus_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_recommendations_user   ON public.recommendations(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Tasks: users can only CRUD their own tasks
CREATE POLICY "tasks_select_own" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert_own" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_own" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks_delete_own" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Focus sessions: users can only CRUD their own sessions
CREATE POLICY "sessions_select_own" ON public.focus_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert_own" ON public.focus_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update_own" ON public.focus_sessions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessions_delete_own" ON public.focus_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Recommendations: users can only see their own
CREATE POLICY "recs_select_own" ON public.recommendations
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "recs_insert_own" ON public.recommendations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recs_delete_own" ON public.recommendations
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
