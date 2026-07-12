from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trip import Trip
from app.repositories.trip_repository import TripRepository
from app.schemas.trip import GenerateItineraryRequest, TripCreateRequest
from app.services.ai_service import AIService


class TripService:
    """
    Business logic untuk manajemen trip.
    Mengorkestrasi TripRepository dan AIService.
    """

    def __init__(self, db: AsyncSession) -> None:
        self.trip_repo = TripRepository(db)
        self.ai_service = AIService()

    async def get_user_trips(self, user_id: int) -> list[Trip]:
        """Mengambil semua trip milik user."""
        return await self.trip_repo.get_all_by_user(user_id)

    async def get_trip_detail(self, trip_id: int, user_id: int) -> Trip:
        """
        Mengambil detail trip berdasarkan ID.

        Raises:
            HTTPException 404: Jika trip tidak ditemukan atau bukan milik user.
        """
        trip = await self.trip_repo.get_by_id(trip_id, user_id)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Trip dengan ID {trip_id} tidak ditemukan",
            )
        return trip

    async def create_trip(self, user_id: int, request: TripCreateRequest) -> Trip:
        """Membuat trip baru untuk user."""
        return await self.trip_repo.create(
            user_id=user_id,
            title=request.title,
            destination=request.destination,
            description=request.description,
            start_date=request.start_date,
            end_date=request.end_date,
        )

    async def generate_itinerary(
        self, user_id: int, request: GenerateItineraryRequest
    ) -> Trip:
        """
        Generate itinerary menggunakan AI dan simpan hasilnya ke trip.

        Langkah:
        1. Ambil trip dari database.
        2. Kirim data trip ke AIService untuk di-generate.
        3. Simpan itinerary ke database.
        """
        trip = await self.get_trip_detail(request.trip_id, user_id)
        itinerary = await self.ai_service.generate_trip_itinerary(
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            preferences=request.preferences,
        )
        return await self.trip_repo.update_itinerary(trip, itinerary)

    async def delete_trip(self, trip_id: int, user_id: int) -> None:
        """Soft delete trip milik user."""
        trip = await self.get_trip_detail(trip_id, user_id)
        await self.trip_repo.soft_delete(trip)
