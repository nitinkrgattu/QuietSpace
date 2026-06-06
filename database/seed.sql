-- ============================================
-- QuietSpace Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- NOTE: Replace the UUIDs with real user IDs
--       from your Supabase auth.users table
-- ============================================

-- ── Demo User Profile ──
-- First create a user via Supabase Auth, then run this
-- Replace 'YOUR-USER-UUID-HERE' with the actual user ID

DO $$
DECLARE
    demo_user_id UUID := 'YOUR-USER-UUID-HERE';
BEGIN

-- ── Profile ──
INSERT INTO public.profiles (id, email, name, daily_goal_hours, weekly_goal_hours)
VALUES (demo_user_id, 'demo@quietspace.app', 'Demo Student', 4.0, 20.0)
ON CONFLICT (id) DO UPDATE SET
    name              = EXCLUDED.name,
    daily_goal_hours  = EXCLUDED.daily_goal_hours,
    weekly_goal_hours = EXCLUDED.weekly_goal_hours;

-- ── Tasks ──
INSERT INTO public.tasks (user_id, text, subject, priority, completed, completed_at, created_at, updated_at) VALUES
(demo_user_id, 'Complete Mathematics Assignment Chapter 5', 'Mathematics', 'high',   TRUE,  NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
(demo_user_id, 'Read Computer Science textbook pages 120-145', 'Computer Science', 'high', FALSE, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(demo_user_id, 'Write essay introduction for English Literature', 'English', 'medium', TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
(demo_user_id, 'Review Physics formulas for upcoming test', 'Physics', 'high', FALSE, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(demo_user_id, 'Complete online quiz for Business Studies', 'Business Studies', 'medium', TRUE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days'),
(demo_user_id, 'Prepare presentation slides for group project', 'General', 'medium', FALSE, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(demo_user_id, 'Practice past exam papers for Statistics', 'Mathematics', 'high', FALSE, NULL, NOW(), NOW()),
(demo_user_id, 'Watch lecture recording for Economics module', 'Economics', 'low', TRUE, NOW() - INTERVAL '4 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '4 days');

-- ── Focus Sessions ──
INSERT INTO public.focus_sessions (user_id, duration_minutes, phase, status, started_at, ended_at, created_at) VALUES
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '6 days 9 hours',  NOW() - INTERVAL '6 days 8 hours 35 minutes', NOW() - INTERVAL '6 days'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '6 days 8 hours',  NOW() - INTERVAL '6 days 7 hours 35 minutes', NOW() - INTERVAL '6 days'),
(demo_user_id, 45, 'focus', 'completed', NOW() - INTERVAL '5 days 10 hours', NOW() - INTERVAL '5 days 9 hours 15 minutes', NOW() - INTERVAL '5 days'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '5 days 8 hours',  NOW() - INTERVAL '5 days 7 hours 35 minutes', NOW() - INTERVAL '5 days'),
(demo_user_id, 60, 'focus', 'completed', NOW() - INTERVAL '4 days 11 hours', NOW() - INTERVAL '4 days 10 hours',           NOW() - INTERVAL '4 days'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '4 days 9 hours',  NOW() - INTERVAL '4 days 8 hours 35 minutes', NOW() - INTERVAL '4 days'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '3 days 10 hours', NOW() - INTERVAL '3 days 9 hours 35 minutes', NOW() - INTERVAL '3 days'),
(demo_user_id, 45, 'focus', 'completed', NOW() - INTERVAL '3 days 8 hours',  NOW() - INTERVAL '3 days 7 hours 15 minutes', NOW() - INTERVAL '3 days'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '2 days 9 hours',  NOW() - INTERVAL '2 days 8 hours 35 minutes', NOW() - INTERVAL '2 days'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '2 days 8 hours',  NOW() - INTERVAL '2 days 7 hours 35 minutes', NOW() - INTERVAL '2 days'),
(demo_user_id, 60, 'focus', 'completed', NOW() - INTERVAL '1 day 10 hours',  NOW() - INTERVAL '1 day 9 hours',             NOW() - INTERVAL '1 day'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '1 day 8 hours',   NOW() - INTERVAL '1 day 7 hours 35 minutes',  NOW() - INTERVAL '1 day'),
(demo_user_id, 25, 'focus', 'completed', NOW() - INTERVAL '2 hours',         NOW() - INTERVAL '1 hour 35 minutes',         NOW() - INTERVAL '2 hours'),
(demo_user_id, 45, 'focus', 'completed', NOW() - INTERVAL '1 hour',          NOW() - INTERVAL '15 minutes',                NOW() - INTERVAL '1 hour');

-- ── Recommendations ──
INSERT INTO public.recommendations (user_id, type, title, description, tag, icon, color, generated_at) VALUES
(demo_user_id, 'focus',    'Optimise Your Focus Sessions',   'Based on your session data, you perform best with 25-minute focused blocks. Try the Pomodoro technique: 25 min focus, 5 min break.', 'Productivity', '🎯', '#6C63FF', NOW()),
(demo_user_id, 'schedule', 'Morning Study Advantage',        'Your data shows higher completion rates in morning sessions. Schedule your most challenging tasks between 8–11 AM for peak performance.', 'Scheduling', '🌅', '#FFB347', NOW()),
(demo_user_id, 'break',    'Strategic Break Timing',         'Taking regular breaks improves retention by up to 40%. After every 2 focus sessions, take a 10-minute walk or stretch.', 'Wellness', '🧘', '#43D9AD', NOW()),
(demo_user_id, 'subject',  'Interleaved Practice',           'Switching between subjects during study sessions improves long-term retention. Alternate between subjects every 25 minutes.', 'Learning', '📚', '#FF6584', NOW()),
(demo_user_id, 'environment', 'Optimise Your Study Space',   'A clutter-free desk and consistent study location trains your brain to enter focus mode faster.', 'Environment', '🏠', '#4FC3F7', NOW());

END $$;
