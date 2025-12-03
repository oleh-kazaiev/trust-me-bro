from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    """Request schema for user login."""

    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)


class TokenResponse(BaseModel):
    """Response schema for JWT token."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Response schema for user info."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    is_active: bool
    is_admin: bool
    created_at: datetime


class UserCreate(BaseModel):
    """Request schema for creating a new user."""

    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """Request schema for updating a user (admin only)."""

    is_active: bool | None = None
    is_admin: bool | None = None
