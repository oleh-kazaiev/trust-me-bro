from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from redis_client import get_redis
from routes.redirect.schemas import RedirectResponse
from routes.redirect.service import LinkService

router = APIRouter(tags=["redirect"])


@router.get("/redirect/{short_code}", response_model=RedirectResponse)
async def get_original_url(
    short_code: str,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
) -> RedirectResponse:
    """Get the original URL for a short code and increment click count."""
    service = LinkService(db, redis)
    url = await service.get_original_url(short_code)

    if not url:
        raise HTTPException(status_code=404, detail="Link not found")

    return RedirectResponse(url=url)
