from pydantic import BaseModel


class RedirectResponse(BaseModel):
    """Response schema for redirect endpoint."""

    url: str
