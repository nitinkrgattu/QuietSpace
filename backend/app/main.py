# ============================================
# main.py
# FastAPI application entry point
# QuietSpace Backend API
# ============================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes import auth, tasks, sessions, progress, recommendations
from app.config import settings

# ── Create FastAPI app ──
app = FastAPI(
    title="QuietSpace API",
    description="AI-powered productivity and focus optimisation platform for students",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── CORS Middleware ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Include Routers ──
app.include_router(auth.router,            prefix="/api/auth",            tags=["Authentication"])
app.include_router(tasks.router,           prefix="/api/tasks",           tags=["Tasks"])
app.include_router(sessions.router,        prefix="/api/sessions",        tags=["Focus Sessions"])
app.include_router(progress.router,        prefix="/api",                 tags=["Progress"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["AI Recommendations"])

# ── Health Check ──
@app.get("/api/health", tags=["Health"])
async def health_check():
    return JSONResponse({"status": "healthy", "service": "QuietSpace API", "version": "1.0.0"})

# ── Root ──
@app.get("/", tags=["Root"])
async def root():
    return JSONResponse({
        "message": "QuietSpace API",
        "docs": "/api/docs",
        "health": "/api/health",
    })
