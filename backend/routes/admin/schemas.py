from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LinkStats(BaseModel):
    """Response schema for link statistics."""

    model_config = ConfigDict(from_attributes=True)

    short_code: str
    original_url: str
    clicks: int
    created_at: datetime
    created_by_username: str | None = None
