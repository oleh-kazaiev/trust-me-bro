from redis.asyncio import Redis
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models import Link

REDIS_CACHE_TTL = 86400  # 1 day in seconds


class LinkService:
    """Service for link-related operations."""

    def __init__(self, db: AsyncSession, redis: Redis):
        self.db = db
        self.redis = redis

    async def get_original_url(self, short_code: str) -> str | None:
        """
        Get the original URL for a short code.
        Checks Redis cache first, falls back to database.
        Increments click count on each access.

        Returns None if link not found.
        """
        cache_key = f"link:{short_code}"

        # Check Redis cache first
        cached_url = await self.redis.get(cache_key)
        if cached_url:
            await self._increment_clicks(short_code)
            return cached_url

        # Check database
        result = await self.db.execute(
            select(Link).filter(Link.short_code == short_code)
        )
        link = result.scalar_one_or_none()

        if not link:
            return None

        # Cache in Redis
        await self.redis.set(cache_key, link.original_url, ex=REDIS_CACHE_TTL)

        # Increment clicks
        link.clicks += 1
        await self.db.commit()

        return link.original_url

    async def _increment_clicks(self, short_code: str) -> None:
        """Increment click count for a link."""
        await self.db.execute(
            update(Link)
            .where(Link.short_code == short_code)
            .values(clicks=Link.clicks + 1)
        )
        await self.db.commit()
