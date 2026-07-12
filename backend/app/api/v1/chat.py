from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.repositories.trip_repository import TripRepository
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/chat", tags=["AI Chat"])


@router.post(
    "/message",
    response_model=ChatMessageResponse,
    summary="Kirim pesan ke TripMind AI",
)
async def send_message(
    request: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ChatMessageResponse:
    """
    Mengirim pesan ke AI travel assistant dan mendapatkan respons.

    Jika `trip_id` disertakan, AI akan menggunakan data trip sebagai konteks
    untuk memberikan rekomendasi yang lebih relevan.
    """
    ai_service = AIService()
    trip_context = None

    # Jika ada trip_id, ambil data trip untuk dijadikan konteks AI
    if request.trip_id:
        trip_repo = TripRepository(db)
        trip = await trip_repo.get_by_id(request.trip_id, current_user.id)
        if trip:
            trip_context = (
                f"Destinasi: {trip.destination}, "
                f"Judul: {trip.title}, "
                f"Tanggal: {trip.start_date} - {trip.end_date}"
            )

    reply = await ai_service.chat(
        message=request.message,
        trip_context=trip_context,
    )

    return ChatMessageResponse(reply=reply, model_used=settings.openai_model)
