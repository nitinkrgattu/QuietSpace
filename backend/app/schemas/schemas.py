# ============================================
# schemas.py
# Pydantic request/response models
# Input validation and serialisation
# ============================================

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ── Enums ──
class PriorityEnum(str, Enum):
    high   = "high"
    medium = "medium"
    low    = "low"

class SessionStatusEnum(str, Enum):
    completed = "completed"
    abandoned = "abandoned"


# ── Auth Schemas ──
class RegisterRequest(BaseModel):
    email:    EmailStr
    password: str = Field(min_length=6)
    name:     str = Field(min_length=1, max_length=100)

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class ProfileResponse(BaseModel):
    id:                 str
    email:              str
    name:               Optional[str]
    daily_goal_hours:   float = 4.0
    weekly_goal_hours:  float = 20.0
    created_at:         Optional[datetime]


# ── Task Schemas ──
class TaskCreate(BaseModel):
    text:     str = Field(min_length=1, max_length=500)
    subject:  Optional[str] = Field(default="General", max_length=100)
    priority: PriorityEnum  = PriorityEnum.medium

class TaskUpdate(BaseModel):
    text:     Optional[str] = Field(None, min_length=1, max_length=500)
    subject:  Optional[str] = Field(None, max_length=100)
    priority: Optional[PriorityEnum] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id:           str
    user_id:      str
    text:         str
    subject:      str
    priority:     str
    completed:    bool
    completed_at: Optional[datetime]
    created_at:   datetime
    updated_at:   datetime


# ── Focus Session Schemas ──
class SessionCreate(BaseModel):
    duration_minutes: int = Field(gt=0, le=480)
    started_at:       datetime
    ended_at:         datetime
    status:           SessionStatusEnum = SessionStatusEnum.completed
    phase:            Optional[str] = "focus"

class SessionUpdate(BaseModel):
    duration_minutes: Optional[int] = None
    status:           Optional[SessionStatusEnum] = None

class SessionResponse(BaseModel):
    id:               str
    user_id:          str
    duration_minutes: int
    phase:            str
    status:           str
    started_at:       datetime
    ended_at:         datetime
    created_at:       datetime


# ── Progress Schemas ──
class DailyData(BaseModel):
    day:      str
    hours:    float
    sessions: int

class StreakData(BaseModel):
    current:      int
    longest:      int
    last_studied: Optional[str]

class GoalData(BaseModel):
    target:     float
    completed:  float
    percentage: int

class AnalyticsResponse(BaseModel):
    weekly_data:      List[DailyData]
    streak:           StreakData
    daily_goal:       GoalData
    weekly_progress:  GoalData
    milestones:       List[dict]


# ── Recommendation Schemas ──
class RecommendationResponse(BaseModel):
    id:           str
    type:         str
    title:        str
    description:  str
    tag:          Optional[str]
    icon:         Optional[str]
    color:        Optional[str]
    generated_at: datetime
