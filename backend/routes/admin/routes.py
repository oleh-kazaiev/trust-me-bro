from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import get_db
from models import Link, User
from routes.admin.schemas import LinkStats
from routes.auth.service import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the caller is an admin user."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )
    return current_user


@router.get("/stats", response_model=list[LinkStats])
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> list[dict]:
    """Get statistics for all links. Requires admin authentication."""
    result = await db.execute(
        select(Link).options(selectinload(Link.user)).order_by(Link.created_at.desc())
    )
    links = result.scalars().all()

    # Convert to dict with created_by_username
    return [
        {
            "short_code": link.short_code,
            "original_url": link.original_url,
            "clicks": link.clicks,
            "created_at": link.created_at,
            "created_by_username": link.user.username if link.user else None,
        }
        for link in links
    ]
