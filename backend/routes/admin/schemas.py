from datetime import datetime

from pydantic import BaseModel, ConfigDict, HttpUrl


class LinkCreate(BaseModel):
    """Request schema for creating a new short link."""

    url: HttpUrl


class LinkResponse(BaseModel):
    """Response schema for a short link."""

    model_config = ConfigDict(from_attributes=True)

    short_code: str
    original_url: str
    clicks: int


class LinkStats(BaseModel):
    """Response schema for link statistics."""

    model_config = ConfigDict(from_attributes=True)

    short_code: str
    original_url: str
    clicks: int
    created_at: datetime
    created_by_username: str | None = None
