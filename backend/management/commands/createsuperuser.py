import argparse
import asyncio
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy.future import select

from database import AsyncSessionLocal
from models import User
from routes.auth.service import hash_password


async def create_superuser(
    username: str,
    password: str,
    is_active: bool = True,
    is_admin: bool = True,
) -> None:
    """Create a superuser (active admin) if not exists."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).filter(User.username == username))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            print(f"User '{username}' already exists. Updating...")
            existing_user.password_hash = hash_password(password)
            existing_user.is_active = is_active
            existing_user.is_admin = is_admin
            await session.commit()
            print(
                f"Updated user '{username}': is_active={is_active}, is_admin={is_admin}"
            )
        else:
            new_user = User(
                username=username,
                password_hash=hash_password(password),
                is_active=is_active,
                is_admin=is_admin,
            )
            session.add(new_user)
            await session.commit()
            print(
                f"Created superuser '{username}': is_active={is_active}, is_admin={is_admin}"
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a superuser (active admin)")
    parser.add_argument("username", help="Username (email)")
    parser.add_argument("password", help="Password")
    parser.add_argument(
        "--inactive",
        action="store_true",
        default=False,
        help="Create user as inactive",
    )
    parser.add_argument(
        "--no-admin",
        action="store_true",
        default=False,
        help="Don't grant admin privileges",
    )

    args = parser.parse_args()

    asyncio.run(
        create_superuser(
            args.username,
            args.password,
            is_active=not args.inactive,
            is_admin=not args.no_admin,
        )
    )


if __name__ == "__main__":
    main()
