from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, Text, String, Integer, func, LargeBinary
from app.db.base import Base
from datetime import datetime

class Animal(Base):
    __tablename__ = "animals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    bio: Mapped[str] = mapped_column(Text)
    admission_date: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    status: Mapped[str] = mapped_column(String, default="recovering", nullable=False)
    journey_story: Mapped[str] = mapped_column(Text, nullable=True)
    journey_story: Mapped[str] = mapped_column(Text, nullable=True)
    image_data: Mapped[bytes] = mapped_column(LargeBinary, nullable=True)
    image_content_type: Mapped[str] = mapped_column(String, nullable=True)

    milestones = relationship("Milestone", back_populates="animal", cascade="all, delete-orphan")

    
