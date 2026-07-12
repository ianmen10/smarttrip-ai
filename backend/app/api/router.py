from fastapi import APIRouter

from app.api.v1 import auth, chat, trips

# Router utama untuk semua endpoint v1
api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(trips.router)
api_router.include_router(chat.router)
