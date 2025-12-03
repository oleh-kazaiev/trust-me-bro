import random
import string

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
from models import Link, User
from routes.auth.service import get_current_user
from routes.links.schemas import LinkCreate, LinkResponse

router = APIRouter(prefix="/links", tags=["links"])


def generate_short_code(length: int = 9) -> str:
    """Generate a random alphanumeric short code."""
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for _ in range(length))


async def require_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the caller is an active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account not activated. Please contact an admin.",
        )
    return current_user


@router.post("/create", response_model=LinkResponse)
async def create_link(
    link: LinkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_active_user),
) -> Link:
    """Create a new short link. Requires active user authentication."""
    short_code = generate_short_code()

    # Ensure uniqueness with retry loop
    max_retries = 10
    for _ in range(max_retries):
        result = await db.execute(select(Link).filter(Link.short_code == short_code))
        if not result.scalar_one_or_none():
            break
        short_code = generate_short_code()
    else:
        raise HTTPException(
            status_code=500, detail="Failed to generate unique short code"
        )

    new_link = Link(
        short_code=short_code,
        original_url=str(link.url),
        user_id=current_user.id,
    )
    db.add(new_link)
    await db.commit()
    await db.refresh(new_link)
    return new_link


@router.get("", response_model=list[LinkResponse])
async def get_my_links(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_active_user),
) -> list[Link]:
    """Get all links created by the current user."""
    result = await db.execute(
        select(Link)
        .filter(Link.user_id == current_user.id)
        .order_by(Link.created_at.desc())
    )
    return result.scalars().all()


@router.delete("/{short_code}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_link(
    short_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_active_user),
) -> None:
    """Delete a link. Users can only delete their own links."""
    result = await db.execute(select(Link).filter(Link.short_code == short_code))
    link = result.scalar_one_or_none()

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )

    # Check ownership (unless admin)
    if link.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own links",
        )

    await db.delete(link)
    await db.commit()
