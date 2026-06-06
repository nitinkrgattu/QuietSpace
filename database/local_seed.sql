-- ============================================
-- QuietSpace local-auth sample data
-- Run AFTER database/local_auth.sql in Supabase SQL Editor.
-- Safe to run multiple times; existing rows are preserved.
-- ============================================

DO $$
DECLARE
    demo_user_id UUID;
    sample_user_id UUID;
    demo_password_hash TEXT := 'pbkdf2_sha256$260000$717569657473706163655f64656d6f5f31$cd39d06d00c78299f15025e8f46480aeb2040d2cb15526ca71e5fda5731303d1';
BEGIN
    -- Demo account:
    -- email: demo@quietspace.app
    -- password: demo123456
    INSERT INTO public.local_users (email, password_hash, name)
    VALUES ('demo@quietspace.app', demo_password_hash, 'Demo Student')
    ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = COALESCE(public.local_users.name, EXCLUDED.name)
    RETURNING id INTO demo_user_id;

    INSERT INTO public.local_users (email, password_hash, name)
    VALUES ('sample@quietspace.app', demo_password_hash, 'Sample Student')
    ON CONFLICT (email) DO UPDATE SET
        name = COALESCE(public.local_users.name, EXCLUDED.name)
    RETURNING id INTO sample_user_id;

    INSERT INTO public.profiles (id, email, name, daily_goal_hours, weekly_goal_hours)
    VALUES
        (demo_user_id, 'demo@quietspace.app', 'Demo Student', 4.0, 20.0),
        (sample_user_id, 'sample@quietspace.app', 'Sample Student', 3.0, 15.0)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(public.profiles.name, EXCLUDED.name),
        daily_goal_hours = COALESCE(public.profiles.daily_goal_hours, EXCLUDED.daily_goal_hours),
        weekly_goal_hours = COALESCE(public.profiles.weekly_goal_hours, EXCLUDED.weekly_goal_hours);

    -- Demo tasks
    INSERT INTO public.tasks (user_id, text, subject, priority, completed, completed_at, created_at, updated_at)
    SELECT demo_user_id, seed.text, seed.subject, seed.priority, seed.completed, seed.completed_at, seed.created_at, seed.updated_at
    FROM (
        VALUES
        ('Complete Mathematics Assignment Chapter 5', 'Mathematics', 'high', TRUE, NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
        ('Read Computer Science textbook pages 120-145', 'Computer Science', 'high', FALSE, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
        ('Write essay introduction for English Literature', 'English', 'medium', TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
        ('Review Physics formulas for upcoming test', 'Physics', 'high', FALSE, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
        ('Complete online quiz for Business Studies', 'Business Studies', 'medium', TRUE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days'),
        ('Prepare presentation slides for group project', 'General', 'medium', FALSE, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
        ('Practice past exam papers for Statistics', 'Mathematics', 'high', FALSE, NULL, NOW(), NOW()),
        ('Watch lecture recording for Economics module', 'Economics', 'low', TRUE, NOW() - INTERVAL '4 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '4 days')
    ) AS seed(text, subject, priority, completed, completed_at, created_at, updated_at)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.tasks existing
        WHERE existing.user_id = demo_user_id
          AND existing.text = seed.text
    );

    -- Sample user tasks
    INSERT INTO public.tasks (user_id, text, subject, priority, completed, completed_at, created_at, updated_at)
    SELECT sample_user_id, seed.text, seed.subject, seed.priority, seed.completed, seed.completed_at, seed.created_at, seed.updated_at
    FROM (
        VALUES
        ('Plan weekly study schedule', 'General', 'medium', TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
        ('Revise Biology notes', 'Biology', 'high', FALSE, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
        ('Practice Spanish vocabulary', 'Languages', 'low', FALSE, NULL, NOW(), NOW())
    ) AS seed(text, subject, priority, completed, completed_at, created_at, updated_at)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.tasks existing
        WHERE existing.user_id = sample_user_id
          AND existing.text = seed.text
    );

    -- Demo focus sessions
    INSERT INTO public.focus_sessions (user_id, duration_minutes, phase, status, started_at, ended_at, created_at)
    SELECT demo_user_id, seed.duration_minutes, 'focus', 'completed', seed.started_at, seed.ended_at, seed.created_at
    FROM (
        VALUES
        (25, NOW() - INTERVAL '6 days 9 hours', NOW() - INTERVAL '6 days 8 hours 35 minutes', NOW() - INTERVAL '6 days'),
        (25, NOW() - INTERVAL '6 days 8 hours', NOW() - INTERVAL '6 days 7 hours 35 minutes', NOW() - INTERVAL '6 days'),
        (45, NOW() - INTERVAL '5 days 10 hours', NOW() - INTERVAL '5 days 9 hours 15 minutes', NOW() - INTERVAL '5 days'),
        (25, NOW() - INTERVAL '5 days 8 hours', NOW() - INTERVAL '5 days 7 hours 35 minutes', NOW() - INTERVAL '5 days'),
        (60, NOW() - INTERVAL '4 days 11 hours', NOW() - INTERVAL '4 days 10 hours', NOW() - INTERVAL '4 days'),
        (25, NOW() - INTERVAL '4 days 9 hours', NOW() - INTERVAL '4 days 8 hours 35 minutes', NOW() - INTERVAL '4 days'),
        (25, NOW() - INTERVAL '3 days 10 hours', NOW() - INTERVAL '3 days 9 hours 35 minutes', NOW() - INTERVAL '3 days'),
        (45, NOW() - INTERVAL '3 days 8 hours', NOW() - INTERVAL '3 days 7 hours 15 minutes', NOW() - INTERVAL '3 days'),
        (25, NOW() - INTERVAL '2 days 9 hours', NOW() - INTERVAL '2 days 8 hours 35 minutes', NOW() - INTERVAL '2 days'),
        (25, NOW() - INTERVAL '2 days 8 hours', NOW() - INTERVAL '2 days 7 hours 35 minutes', NOW() - INTERVAL '2 days'),
        (60, NOW() - INTERVAL '1 day 10 hours', NOW() - INTERVAL '1 day 9 hours', NOW() - INTERVAL '1 day'),
        (25, NOW() - INTERVAL '1 day 8 hours', NOW() - INTERVAL '1 day 7 hours 35 minutes', NOW() - INTERVAL '1 day'),
        (25, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 35 minutes', NOW() - INTERVAL '2 hours'),
        (45, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '1 hour')
    ) AS seed(duration_minutes, started_at, ended_at, created_at)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.focus_sessions existing
        WHERE existing.user_id = demo_user_id
          AND existing.started_at::date = seed.started_at::date
          AND existing.duration_minutes = seed.duration_minutes
    );

    -- Sample focus sessions
    INSERT INTO public.focus_sessions (user_id, duration_minutes, phase, status, started_at, ended_at, created_at)
    SELECT sample_user_id, seed.duration_minutes, 'focus', 'completed', seed.started_at, seed.ended_at, seed.created_at
    FROM (
        VALUES
        (25, NOW() - INTERVAL '3 days 7 hours', NOW() - INTERVAL '3 days 6 hours 35 minutes', NOW() - INTERVAL '3 days'),
        (30, NOW() - INTERVAL '2 days 6 hours', NOW() - INTERVAL '2 days 5 hours 30 minutes', NOW() - INTERVAL '2 days'),
        (25, NOW() - INTERVAL '1 day 5 hours', NOW() - INTERVAL '1 day 4 hours 35 minutes', NOW() - INTERVAL '1 day')
    ) AS seed(duration_minutes, started_at, ended_at, created_at)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.focus_sessions existing
        WHERE existing.user_id = sample_user_id
          AND existing.started_at::date = seed.started_at::date
          AND existing.duration_minutes = seed.duration_minutes
    );

    INSERT INTO public.recommendations (user_id, type, title, description, tag, icon, color, generated_at)
    SELECT demo_user_id, seed.type, seed.title, seed.description, seed.tag, seed.icon, seed.color, NOW()
    FROM (
        VALUES
        ('focus', 'Optimise Your Focus Sessions', 'Based on your session data, you perform best with 25-minute focused blocks. Try the Pomodoro technique: 25 min focus, 5 min break.', 'Productivity', '🎯', '#6C63FF'),
        ('schedule', 'Morning Study Advantage', 'Your data shows higher completion rates in morning sessions. Schedule your most challenging tasks between 8-11 AM for peak performance.', 'Scheduling', '🌅', '#FFB347'),
        ('break', 'Strategic Break Timing', 'Taking regular breaks improves retention by up to 40%. After every 2 focus sessions, take a 10-minute walk or stretch.', 'Wellness', '🧘', '#43D9AD'),
        ('subject', 'Interleaved Practice', 'Switching between subjects during study sessions improves long-term retention. Alternate between subjects every 25 minutes.', 'Learning', '📚', '#FF6584'),
        ('environment', 'Optimise Your Study Space', 'A clutter-free desk and consistent study location trains your brain to enter focus mode faster.', 'Environment', '🏠', '#4FC3F7')
    ) AS seed(type, title, description, tag, icon, color)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.recommendations existing
        WHERE existing.user_id = demo_user_id
          AND existing.title = seed.title
    );
END $$;
