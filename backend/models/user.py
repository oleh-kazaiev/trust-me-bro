import uuid

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False)  # New users must be activated
    is_admin = Column(Boolean, default=False)  # Admin users can manage other users
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to links created by this user
    created_links = relationship("Link", back_populates="user")
