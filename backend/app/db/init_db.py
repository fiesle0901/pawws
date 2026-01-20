import logging
from app.db.base import AsyncSessionLocal
from app.auth.security import get_password_hash
from app.auth.models import User
from sqlalchemy import select

logger = logging.getLogger(__name__)

async def init_db():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@example.com"))
        user = result.scalar_one_or_none()
        
        if not user:
            logger.info("Creating initial admin user...")
            user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True,
            )
            session.add(user)
            await session.commit()
            logger.info("Admin user created: admin@example.com / admin123")
        else:
            logger.info("Admin user already exists.")
