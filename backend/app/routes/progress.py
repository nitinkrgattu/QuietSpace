# ============================================
# routes/progress.py
# Progress and analytics endpoints
# GET /progress, GET /analytics
# ============================================

from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone, timedelta
from app.middleware.auth_middleware import verify_token
from app.database.supabase_client import supabase

router = APIRouter()

# Milestone definitions
MILESTONES = [
    {"id": 1, "title": "First Session",    "icon": "🌱", "description": "Completed your first focus session",  "threshold": 1,   "type": "sessions"},
    {"id": 2, "title": "3-Day Streak",     "icon": "🔥", "description": "Studied 3 days in a row",            "threshold": 3,   "type": "streak"},
    {"id": 3, "title": "7-Day Streak",     "icon": "⚡", "description": "Studied 7 days in a row",            "threshold": 7,   "type": "streak"},
    {"id": 4, "title": "10 Hours Focused", "icon": "⏱️", "description": "Accumulated 10 hours of focus time", "threshold": 600, "type": "minutes"},
    {"id": 5, "title": "25 Sessions",      "icon": "🎯", "description": "Completed 25 focus sessions",        "threshold": 25,  "type": "sessions"},
    {"id": 6, "title": "14-Day Streak",    "icon": "🏆", "description": "Study 14 days in a row",             "threshold": 14,  "type": "streak"},
    {"id": 7, "title": "50 Hours Focused", "icon": "💎", "description": "Accumulate 50 hours of focus time",  "threshold": 3000,"type": "minutes"},
    {"id": 8, "title": "100 Sessions",     "icon": "🚀", "description": "Complete 100 focus sessions",        "threshold": 100, "type": "sessions"},
]


@router.get("/progress")
async def get_progress(user_id: str = Depends(verify_token)):
    """Get raw progress stats for the user."""
    try:
        sessions = supabase.table("focus_sessions").select("*").eq("user_id", user_id).eq("status", "completed").execute()
        tasks    = supabase.table("tasks").select("*").eq("user_id", user_id).execute()
        return {
            "total_sessions":   len(sessions.data or []),
            "total_minutes":    sum(s.get("duration_minutes", 0) for s in (sessions.data or [])),
            "total_tasks":      len(tasks.data or []),
            "completed_tasks":  sum(1 for t in (tasks.data or []) if t.get("completed")),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analytics")
async def get_analytics(user_id: str = Depends(verify_token)):
    """Compute full analytics: weekly chart, streak, goals, milestones."""
    try:
        sessions_res = supabase.table("focus_sessions").select("*").eq("user_id", user_id).eq("status", "completed").execute()
        sessions = sessions_res.data or []

        profile_res = supabase.table("profiles").select("daily_goal_hours,weekly_goal_hours").eq("id", user_id).single().execute()
        profile = profile_res.data or {}
        daily_goal_hours  = float(profile.get("daily_goal_hours",  4))
        weekly_goal_hours = float(profile.get("weekly_goal_hours", 20))

        now   = datetime.now(timezone.utc)
        today = now.date()

        # ── Weekly chart (last 7 days) ──
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        weekly_data = []
        for i in range(6, -1, -1):
            day_date = today - timedelta(days=i)
            day_sessions = [
                s for s in sessions
                if s.get("started_at", "")[:10] == str(day_date)
            ]
            hours    = round(sum(s.get("duration_minutes", 0) for s in day_sessions) / 60, 1)
            day_name = day_names[day_date.weekday()]
            weekly_data.append({"day": day_name, "hours": hours, "sessions": len(day_sessions)})

        # ── Daily goal ──
        today_sessions = [s for s in sessions if s.get("started_at", "")[:10] == str(today)]
        today_minutes  = sum(s.get("duration_minutes", 0) for s in today_sessions)
        today_hours    = round(today_minutes / 60, 1)
        daily_pct      = min(100, round((today_hours / daily_goal_hours) * 100)) if daily_goal_hours > 0 else 0

        # ── Weekly goal ──
        week_start = today - timedelta(days=today.weekday())
        week_sessions = [s for s in sessions if s.get("started_at", "")[:10] >= str(week_start)]
        week_minutes  = sum(s.get("duration_minutes", 0) for s in week_sessions)
        week_hours    = round(week_minutes / 60, 1)
        weekly_pct    = min(100, round((week_hours / weekly_goal_hours) * 100)) if weekly_goal_hours > 0 else 0

        # ── Streak calculation ──
        study_dates = sorted(set(s.get("started_at", "")[:10] for s in sessions if s.get("started_at")), reverse=True)
        current_streak = 0
        longest_streak = 0
        last_studied   = study_dates[0] if study_dates else None

        if study_dates:
            streak = 1
            for j in range(1, len(study_dates)):
                d1 = datetime.strptime(study_dates[j-1], "%Y-%m-%d").date()
                d2 = datetime.strptime(study_dates[j],   "%Y-%m-%d").date()
                if (d1 - d2).days == 1:
                    streak += 1
                else:
                    longest_streak = max(longest_streak, streak)
                    streak = 1
            longest_streak = max(longest_streak, streak)

            # Current streak: count back from today
            check_date = today
            for date_str in study_dates:
                d = datetime.strptime(date_str, "%Y-%m-%d").date()
                if d == check_date or d == check_date - timedelta(days=1):
                    current_streak += 1
                    check_date = d - timedelta(days=1) if d == check_date else d
                else:
                    break

        # ── Milestones ──
        total_sessions = len(sessions)
        total_minutes  = sum(s.get("duration_minutes", 0) for s in sessions)
        computed_milestones = []
        for m in MILESTONES:
            if m["type"] == "sessions":
                achieved = total_sessions >= m["threshold"]
            elif m["type"] == "streak":
                achieved = longest_streak >= m["threshold"]
            else:  # minutes
                achieved = total_minutes >= m["threshold"]
            computed_milestones.append({**m, "achieved": achieved})

        return {
            "weekly_data": weekly_data,
            "streak": {
                "current":      current_streak,
                "longest":      longest_streak,
                "last_studied": last_studied,
            },
            "daily_goal": {
                "target":     daily_goal_hours,
                "completed":  today_hours,
                "percentage": daily_pct,
            },
            "weekly_progress": {
                "target":     weekly_goal_hours,
                "completed":  week_hours,
                "percentage": weekly_pct,
            },
            "milestones": computed_milestones,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
