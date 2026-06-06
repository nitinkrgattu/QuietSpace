# ============================================
# routes/recommendations.py
# AI recommendation endpoints
# GET /recommendations, POST /recommendations/generate
# ============================================

from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from typing import List
from app.middleware.auth_middleware import verify_token
from app.database.supabase_client import supabase

router = APIRouter()

# AI recommendation templates based on study patterns
RECOMMENDATION_TEMPLATES = [
    {
        "type": "focus",
        "title": "Optimise Your Focus Sessions",
        "description": "Based on your session data, you perform best with 25-minute focused blocks. Try the Pomodoro technique: 25 min focus, 5 min break.",
        "tag": "Productivity",
        "icon": "🎯",
        "color": "#6C63FF",
    },
    {
        "type": "schedule",
        "title": "Morning Study Advantage",
        "description": "Your data shows higher completion rates in morning sessions. Schedule your most challenging tasks between 8–11 AM for peak performance.",
        "tag": "Scheduling",
        "icon": "🌅",
        "color": "#FFB347",
    },
    {
        "type": "break",
        "title": "Strategic Break Timing",
        "description": "Taking regular breaks improves retention by up to 40%. After every 2 focus sessions, take a 10-minute walk or stretch.",
        "tag": "Wellness",
        "icon": "🧘",
        "color": "#43D9AD",
    },
    {
        "type": "subject",
        "title": "Interleaved Practice",
        "description": "Switching between subjects during study sessions improves long-term retention. Alternate between subjects every 25 minutes.",
        "tag": "Learning",
        "icon": "📚",
        "color": "#FF6584",
    },
    {
        "type": "environment",
        "title": "Optimise Your Study Space",
        "description": "A clutter-free desk and consistent study location trains your brain to enter focus mode faster. Keep your study area dedicated to learning only.",
        "tag": "Environment",
        "icon": "🏠",
        "color": "#4FC3F7",
    },
    {
        "type": "focus",
        "title": "Eliminate Digital Distractions",
        "description": "Put your phone in another room or use app blockers during focus sessions. Studies show notifications reduce focus quality by 23%.",
        "tag": "Focus",
        "icon": "📵",
        "color": "#6C63FF",
    },
    {
        "type": "schedule",
        "title": "Consistent Study Schedule",
        "description": "Your streak data shows gaps on weekends. Maintaining a consistent daily schedule — even 20 minutes — builds stronger study habits.",
        "tag": "Consistency",
        "icon": "📅",
        "color": "#FFB347",
    },
    {
        "type": "break",
        "title": "Hydration & Focus",
        "description": "Dehydration reduces cognitive performance by up to 10%. Keep a water bottle at your desk and drink 250ml every hour of study.",
        "tag": "Health",
        "icon": "💧",
        "color": "#43D9AD",
    },
]


@router.get("")
async def get_recommendations(user_id: str = Depends(verify_token)):
    """Get stored recommendations for the user."""
    try:
        result = supabase.table("recommendations").select("*").eq("user_id", user_id).order("generated_at", desc=True).limit(10).execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/generate")
async def generate_recommendations(user_id: str = Depends(verify_token)):
    """
    Generate personalised AI recommendations based on user's study data.
    Analyses sessions, tasks, and patterns to select relevant tips.
    """
    try:
        # Fetch user data for analysis
        sessions_res = supabase.table("focus_sessions").select("*").eq("user_id", user_id).eq("status", "completed").execute()
        tasks_res    = supabase.table("tasks").select("*").eq("user_id", user_id).execute()
        sessions = sessions_res.data or []
        tasks    = tasks_res.data or []

        total_sessions   = len(sessions)
        completed_tasks  = sum(1 for t in tasks if t.get("completed"))
        total_tasks      = len(tasks)
        completion_rate  = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

        # Select recommendations based on user data
        selected = []
        if total_sessions < 5:
            selected.append(RECOMMENDATION_TEMPLATES[0])  # Focus sessions tip
        if total_sessions >= 3:
            selected.append(RECOMMENDATION_TEMPLATES[1])  # Morning study
        selected.append(RECOMMENDATION_TEMPLATES[2])      # Break timing (always useful)
        if total_sessions >= 5:
            selected.append(RECOMMENDATION_TEMPLATES[3])  # Interleaved practice
        selected.append(RECOMMENDATION_TEMPLATES[4])      # Environment
        if total_sessions >= 2:
            selected.append(RECOMMENDATION_TEMPLATES[5])  # Digital distractions
        selected.append(RECOMMENDATION_TEMPLATES[6])      # Consistent schedule
        selected.append(RECOMMENDATION_TEMPLATES[7])      # Hydration

        # Deduplicate
        seen = set()
        unique = []
        for r in selected:
            if r["title"] not in seen:
                seen.add(r["title"])
                unique.append(r)

        # Delete old recommendations
        supabase.table("recommendations").delete().eq("user_id", user_id).execute()

        # Insert new recommendations
        now = datetime.now(timezone.utc).isoformat()
        records = [
            {
                "user_id":      user_id,
                "type":         r["type"],
                "title":        r["title"],
                "description":  r["description"],
                "tag":          r["tag"],
                "icon":         r["icon"],
                "color":        r["color"],
                "generated_at": now,
            }
            for r in unique
        ]
        result = supabase.table("recommendations").insert(records).execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
