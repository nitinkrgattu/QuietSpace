# ============================================
# routes/auth.py
# Local authentication endpoints backed by Supabase database tables
# ============================================

import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from app.config import settings
from app.database.supabase_client import supabase
from app.middleware.auth_middleware import verify_token
from app.schemas.schemas import LoginRequest, ProfileResponse, RegisterRequest

router = APIRouter()

HASH_ALGORITHM = "pbkdf2_sha256"
HASH_ITERATIONS = 260000
TOKEN_EXPIRE_HOURS = 24 * 7


def _hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        HASH_ITERATIONS,
    )
    return f"{HASH_ALGORITHM}${HASH_ITERATIONS}${salt.hex()}${digest.hex()}"


def _verify_password(password: str, password_hash: str) -> bool:
    try:
        algorithm, iterations, salt_hex, digest_hex = password_hash.split("$", 3)
        if algorithm != HASH_ALGORITHM:
            return False
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(digest_hex)
        actual = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            int(iterations),
        )
        return hmac.compare_digest(actual, expected)
    except (TypeError, ValueError):
        return False


def _create_access_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=TOKEN_EXPIRE_HOURS)).timestamp()),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def _user_payload(user: dict) -> dict:
    return {
        "id": str(user["id"]),
        "email": user["email"],
        "name": user.get("name") or "",
    }


def _auth_response(user: dict) -> dict:
    payload = _user_payload(user)
    return {
        "access_token": _create_access_token(payload["id"]),
        "token_type": "bearer",
        "user": payload,
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    """Register a new user in public.local_users."""
    email = body.email.lower().strip()
    existing = supabase.table("local_users").select("id").eq("email", email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    try:
        result = supabase.table("local_users").insert({
            "email": email,
            "password_hash": _hash_password(body.password),
            "name": body.name.strip(),
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not result.data:
        raise HTTPException(status_code=400, detail="Registration failed.")

    user = result.data[0]
    supabase.table("profiles").upsert({
        "id": str(user["id"]),
        "email": email,
        "name": body.name.strip(),
    }).execute()

    return _auth_response(user)


@router.post("/login")
async def login(body: LoginRequest):
    """Login with a local_users email and password."""
    email = body.email.lower().strip()
    result = supabase.table("local_users").select("*").eq("email", email).limit(1).execute()
    user = result.data[0] if result.data else None

    if not user or not _verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password.")

    return _auth_response(user)


@router.post("/logout")
async def logout(user_id: str = Depends(verify_token)):
    """Logout is client-side for stateless JWT auth."""
    return {"message": "Logged out successfully."}


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(user_id: str = Depends(verify_token)):
    """Get the current user's profile."""
    profile = supabase.table("profiles").select("*").eq("id", user_id).limit(1).execute()
    if profile.data:
        return profile.data[0]

    user = supabase.table("local_users").select("id,email,name,created_at").eq("id", user_id).limit(1).execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="Profile not found.")

    local_user = user.data[0]
    return {
        "id": str(local_user["id"]),
        "email": local_user["email"],
        "name": local_user.get("name") or "",
        "daily_goal_hours": 4.0,
        "weekly_goal_hours": 20.0,
        "created_at": local_user.get("created_at"),
    }
