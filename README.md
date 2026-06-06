# 🧘 QuietSpace — AI-Powered Focus & Productivity Platform

> An AI-powered productivity and focus optimisation platform for students and remote learners.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-green)](./backend)
[![Database](https://img.shields.io/badge/Database-Supabase-orange)](./database)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)
- [Deployment](#deployment)

---

## 🎯 Overview

QuietSpace helps students and remote learners:
- Maintain deep focus with Pomodoro-style sessions
- Manage study tasks with priority tracking
- Track productivity progress with real analytics
- Receive AI-powered personalised study recommendations

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Supabase Auth — register, login, session persistence |
| ⏱️ Focus Sessions | Pomodoro timer with 15/25/45/60 min presets |
| ✅ Task Management | Full CRUD with priority levels and subjects |
| 📊 Progress Tracking | Weekly charts, streaks, milestones |
| 🤖 AI Recommendations | Personalised study tips from Python backend |
| 🏆 Success Screen | Session completion celebration |

---

## 🏗️ Architecture

```
Browser (React + Vite)
        │
        ├── Supabase Auth (direct)
        │
        └── FastAPI Backend (Python)
                │
                └── Supabase Database (PostgreSQL)
```

---

## 📁 Project Structure

```
quietspace/
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # AuthContext
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   └── styles/             # Global CSS
│   ├── .env.example
│   └── vercel.json
│
├── backend/                    # FastAPI Python API
│   ├── app/
│   │   ├── routes/             # API route handlers
│   │   ├── schemas/            # Pydantic models
│   │   ├── middleware/         # JWT auth middleware
│   │   ├── database/           # Supabase client
│   │   ├── config.py           # Settings
│   │   └── main.py             # App entry point
│   ├── requirements.txt
│   ├── .env.example
│   └── vercel.json
│
├── database/
│   ├── schema.sql              # Table definitions + RLS
│   └── seed.sql                # Sample data
│
└── docs/
    ├── deployment-guide.md
    ├── api-documentation.md
    └── setup-guide.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- Supabase account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/quietspace.git
cd quietspace
```

### 2. Set up the database
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `database/schema.sql`
3. Optionally run `database/seed.sql` with your user ID for demo data

### 3. Set up the frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 4. Set up the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
uvicorn app.main:app --reload
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=http://localhost:5173
APP_ENV=development
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/profile` | Get user profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tasks` | Get all tasks |
| POST   | `/api/tasks` | Create task |
| PUT    | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH  | `/api/tasks/{id}/complete` | Toggle completion |

### Focus Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/sessions` | Get all sessions |
| POST   | `/api/sessions` | Record session |
| PUT    | `/api/sessions/{id}` | Update session |
| DELETE | `/api/sessions/{id}` | Delete session |

### Progress & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Raw progress stats |
| GET | `/api/analytics` | Full analytics + charts |

### AI Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/recommendations` | Get recommendations |
| POST | `/api/recommendations/generate` | Generate new AI tips |

**Interactive API docs:** `http://localhost:8000/api/docs`

---

## 🗄️ Database Setup

1. Open your Supabase project → **SQL Editor**
2. Run `database/schema.sql` (creates tables, RLS policies, triggers)
3. Optionally run `database/seed.sql` for demo data

### Tables
- `profiles` — User profiles (extends auth.users)
- `tasks` — Study tasks with priority
- `focus_sessions` — Completed focus sessions
- `recommendations` — AI-generated study tips

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
# Set environment variables in Vercel dashboard
```

### Backend (Vercel)
```bash
cd backend
vercel --prod
# Set environment variables in Vercel dashboard
```

### Environment Variables on Vercel
Set these in **Vercel Dashboard → Settings → Environment Variables**:

**Frontend:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (your backend Vercel URL)

**Backend:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_JWT_SECRET`
- `ALLOWED_ORIGINS` (your frontend Vercel URL)

---

## 🛡️ Security

- JWT tokens verified on every protected API request
- Row Level Security (RLS) on all Supabase tables
- Service role key only used server-side (never exposed to browser)
- All secrets stored in environment variables
- Input validation via Pydantic schemas

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for BUS4012 Assignment 03 — QuietSpace AI Productivity Platform*
