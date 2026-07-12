from date import date
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class TripCreateRequest(BaseModel):
    """Request body untuk membuat trip baru."""

    title: str = Field(..., min_length=3, max_length=255, examples=["Liburan Bali 2025"])
    destination: str = Field(..., min_length=2, max_length=255, examples=["Bali, Indonesia"])
    description: str | None = Field(None, examples=["Trip keluarga selama 5 hari"])
    start_date: date | None = Field(None, examples=["2025-08-01"])
    end_date: date | None = Field(None, examples=["2025-08-05"])


class TripUpdateRequest(BaseModel):
    """Request body untuk update trip — semua field opsional (partial update)."""

    title: str | None = Field(None, min_length=3, max_length=255)
    destination: str | None = Field(None, min_length=2, max_length=255)
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    itinerary: dict[str, Any] | None = None


class TripResponse(BaseModel):
    """Response representasi trip."""

    id: int
    user_id: int
    title: str
    destination: str
    description: str | None
    start_date: date | None
    end_date: date | None
    itinerary: dict[str, Any] | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GenerateItineraryRequest(BaseModel):
    """Request untuk generate itinerary menggunakan AI."""

    trip_id: int
    preferences: str | None = Field(
        None,
        examples=["Suka kuliner lokal, hindari wisata pantai, budget menengah"],
    )
