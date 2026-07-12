from datetime import date
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trip import Trip


class TripRepository:
    """
    Data access layer untuk tabel trips.
    Semua query database terkait Trip ada di sini.
    """

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_all_by_user(self, user_id: int) -> list[Trip]:
        """Mengambil semua trip milik user yang tidak di-soft-delete."""
        result = await self.db.execute(
            select(Trip)
            .where(Trip.user_id == user_id, Trip.is_deleted == False)  # noqa: E712
            .order_by(Trip.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, trip_id: int, user_id: int) -> Trip | None:
        """Mengambil trip berdasarkan ID, memastikan trip milik user yang bersangkutan."""
        result = await self.db.execute(
            select(Trip).where(
                Trip.id == trip_id,
                Trip.user_id == user_id,
                Trip.is_deleted == False,  # noqa: E712
            )
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        user_id: int,
        title: str,
        destination: str,
        description: str | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> Trip:
        """Membuat trip baru."""
        trip = Trip(
            user_id=user_id,
            title=title,
            destination=destination,
            description=description,
            start_date=start_date,
            end_date=end_date,
        )
        self.db.add(trip)
        await self.db.commit()
        await self.db.refresh(trip)
        return trip

    async def update_itinerary(self, trip: Trip, itinerary: dict[str, Any]) -> Trip:
        """Menyimpan hasil generate itinerary dari AI ke trip."""
        trip.itinerary = itinerary
        await self.db.commit()
        await self.db.refresh(trip)
        return trip

    async def soft_delete(self, trip: Trip) -> None:
        """Soft delete — set is_deleted = True, data tetap ada di database."""
        trip.is_deleted = True
        await self.db.commit()
