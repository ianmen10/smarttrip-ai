from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.trip import (
    GenerateItineraryRequest,
    TripCreateRequest,
    TripResponse,
)
from app.services.trip_service import TripService

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.get(
    "",
    response_model=list[TripResponse],
    summary="Daftar semua trip milik user",
)
async def get_trips(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TripResponse]:
    """Mengambil semua trip yang dimiliki user yang sedang login."""
    service = TripService(db)
    trips = await service.get_user_trips(current_user.id)
    return [TripResponse.model_validate(t) for t in trips]


@router.post(
    "",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Buat trip baru",
)
async def create_trip(
    request: TripCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    """Membuat rencana perjalanan baru."""
    service = TripService(db)
    trip = await service.create_trip(current_user.id, request)
    return TripResponse.model_validate(trip)


@router.get(
    "/{trip_id}",
    response_model=TripResponse,
    summary="Detail trip berdasarkan ID",
)
async def get_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    """Mengambil detail trip berdasarkan ID."""
    service = TripService(db)
    trip = await service.get_trip_detail(trip_id, current_user.id)
    return TripResponse.model_validate(trip)


@router.post(
    "/generate-itinerary",
    response_model=TripResponse,
    summary="Generate itinerary menggunakan AI",
)
async def generate_itinerary(
    request: GenerateItineraryRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    """
    Menggunakan AI untuk men-generate itinerary perjalanan secara otomatis.
    Hasilnya akan disimpan ke dalam trip yang ditentukan.
    """
    service = TripService(db)
    trip = await service.generate_itinerary(current_user.id, request)
    return TripResponse.model_validate(trip)


@router.delete(
    "/{trip_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus trip",
)
async def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Menghapus trip (soft delete — data tidak benar-benar dihapus)."""
    service = TripService(db)
    await service.delete_trip(trip_id, current_user.id)
