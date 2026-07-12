# TripMind AI 🌍✈️

> AI-powered Travel Companion — Plan your perfect trip with the help of artificial intelligence.

## Overview

TripMind AI adalah aplikasi web yang membantu pengguna merencanakan perjalanan secara cerdas menggunakan AI. Dibangun dengan arsitektur modern yang scalable dan production-ready.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | FastAPI, Python 3.11+ |
| **Database** | PostgreSQL 16 |
| **ORM** | SQLAlchemy (async) |
| **Migration** | Alembic |
| **Auth** | JWT (JSON Web Token) |
| **AI** | OpenAI API (gpt-4o) |
| **Deployment** | Docker & Docker Compose |

## Project Structure

```
tripmind-ai/
├── frontend/          # Next.js App Router
├── backend/           # FastAPI Application
├── docker-compose.yml # Service orchestration
├── .env.example       # Environment template
└── README.md
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) >= 18 (untuk development lokal)
- [Python](https://www.python.org/) >= 3.11 (untuk development lokal)

### Quick Start (Docker)

```bash
# 1. Clone repository
git clone <repo-url>
cd tripmind-ai

# 2. Setup environment
cp .env.example .env
# Edit .env dan isi OPENAI_API_KEY dan SECRET_KEY

# 3. Jalankan semua service
docker-compose up --build

# 4. Akses aplikasi
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup database
alembic upgrade head

# Jalankan server
uvicorn main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Setelah backend berjalan, akses Swagger UI di: `http://localhost:8000/docs`

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register user baru |
| `POST` | `/api/v1/auth/login` | Login & dapatkan JWT token |
| `GET` | `/api/v1/trips` | Daftar trips milik user |
| `POST` | `/api/v1/trips` | Buat trip baru |
| `GET` | `/api/v1/trips/{id}` | Detail trip |
| `DELETE` | `/api/v1/trips/{id}` | Hapus trip |
| `POST` | `/api/v1/chat/message` | Chat dengan AI |

## Architecture

```
Frontend (Next.js)
    ↓ HTTP/REST
Backend (FastAPI)
    ├── Router Layer      → Handle HTTP request/response
    ├── Service Layer     → Business logic
    ├── Repository Layer  → Data access
    └── Database Layer    → PostgreSQL via SQLAlchemy
```

## Environment Variables

Lihat [.env.example](.env.example) untuk daftar lengkap environment variables yang dibutuhkan.

## Contributing

1. Fork repository
2. Buat branch: `git checkout -b feat/nama-fitur`
3. Commit: `git commit -m "feat: deskripsi fitur"`
4. Push: `git push origin feat/nama-fitur`
5. Buat Pull Request

## License

MIT License — Free to use for personal and commercial projects.
