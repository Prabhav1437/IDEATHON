# IDEATHON 2026 - PERN Stack Application

A full-stack hackathon submission platform built with PostgreSQL, Express, React, and Node.js.

## Prerequisites
- Node.js installed
- PostgreSQL (Neon DB recommended)

## Setup Instructions

### 1. Database Setup
Create the `submissions` table using the SQL in `backend/schema.sql`:
```sql
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    team_name TEXT NOT NULL,
    leader_name TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    team_size INTEGER,
    college TEXT,
    track TEXT,
    project_title TEXT,
    project_description TEXT,
    repo_link TEXT,
    demo_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (leader_email, team_name)
);
```

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` from `.env.example` and add your `DATABASE_URL`.
4. `node index.js` (Server starts on port 5000)

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Vite dev server starts)

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Lucide Icons
- **Backend**: Express.js, pg (PostgreSQL client)
- **Database**: PostgreSQL (Neon DB)
