# ============================================
# routes/sessions.py
# Focus session CRUD endpoints
# ============================================

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime, timezone
from app.schemas.schemas import SessionCreate, SessionUpdate, SessionResponse
from app.middleware.auth_middleware import verify_token
from app.database.supabase_client import supabase

router = APIRouter()


@router.get("", response_model=List[SessionResponse])
async def get_sessions(user_id: str = Depends(verify_token)):
    """Get all focus sessions for the authenticated user."""
    try:
        result = supabase.table("focus_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(body: SessionCreate, user_id: str = Depends(verify_token)):
    """Record a completed focus session."""
    try:
        result = supabase.table("focus_sessions").insert({
            "user_id":          user_id,
            "duration_minutes": body.duration_minutes,
            "phase":            body.phase or "focus",
            "status":           body.status.value,
            "started_at":       body.started_at.isoformat(),
            "ended_at":         body.ended_at.isoformat(),
            "created_at":       datetime.now(timezone.utc).isoformat(),
        }).execute()
        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create session.")
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{session_id}", response_model=SessionResponse)
async def update_session(session_id: str, body: SessionUpdate, user_id: str = Depends(verify_token)):
    """Update a focus session."""
    try:
        updates = {k: v for k, v in body.model_dump(exclude_none=True).items()}
        if "status" in updates and hasattr(updates["status"], "value"):
            updates["status"] = updates["status"].value
        result = supabase.table("focus_sessions").update(updates).eq("id", session_id).eq("user_id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Session not found.")
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(session_id: str, user_id: str = Depends(verify_token)):
    """Delete a focus session."""
    try:
        supabase.table("focus_sessions").delete().eq("id", session_id).eq("user_id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
