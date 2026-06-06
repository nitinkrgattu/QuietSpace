# ============================================
# routes/tasks.py
# Task CRUD endpoints
# GET/POST/PUT/DELETE /tasks, PATCH /tasks/{id}/complete
# ============================================

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime, timezone
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.middleware.auth_middleware import verify_token
from app.database.supabase_client import supabase

router = APIRouter()


@router.get("", response_model=List[TaskResponse])
async def get_tasks(user_id: str = Depends(verify_token)):
    """Get all tasks for the authenticated user."""
    try:
        result = supabase.table("tasks").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(body: TaskCreate, user_id: str = Depends(verify_token)):
    """Create a new task."""
    try:
        now = datetime.now(timezone.utc).isoformat()
        result = supabase.table("tasks").insert({
            "user_id":    user_id,
            "text":       body.text,
            "subject":    body.subject or "General",
            "priority":   body.priority.value,
            "completed":  False,
            "created_at": now,
            "updated_at": now,
        }).execute()
        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create task.")
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, body: TaskUpdate, user_id: str = Depends(verify_token)):
    """Update a task."""
    try:
        updates = {k: v for k, v in body.model_dump(exclude_none=True).items()}
        if "priority" in updates and hasattr(updates["priority"], "value"):
            updates["priority"] = updates["priority"].value
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()

        result = supabase.table("tasks").update(updates).eq("id", task_id).eq("user_id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Task not found.")
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, user_id: str = Depends(verify_token)):
    """Delete a task."""
    try:
        supabase.table("tasks").delete().eq("id", task_id).eq("user_id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_complete(task_id: str, user_id: str = Depends(verify_token)):
    """Toggle task completion status."""
    try:
        # Get current state
        current = supabase.table("tasks").select("completed").eq("id", task_id).eq("user_id", user_id).single().execute()
        if not current.data:
            raise HTTPException(status_code=404, detail="Task not found.")

        new_completed = not current.data["completed"]
        now = datetime.now(timezone.utc).isoformat()
        updates = {
            "completed":    new_completed,
            "completed_at": now if new_completed else None,
            "updated_at":   now,
        }
        result = supabase.table("tasks").update(updates).eq("id", task_id).eq("user_id", user_id).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
