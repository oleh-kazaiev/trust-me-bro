from typing import AsyncGenerator

from redis.asyncio import ConnectionPool, Redis

from settings import REDIS_URL

# Create Redis connection pool at module level (like database engine)
redis_pool = ConnectionPool.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)


async def get_redis() -> AsyncGenerator[Redis, None]:
    """Dependency to get Redis connection from pool."""
    redis = Redis(connection_pool=redis_pool)
    try:
        yield redis
    finally:
        await redis.aclose()
