from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
import enum

class MilestoneStatus(str, enum.Enum):
    PENDING = "pending"
    FUNDED = "funded"
    COMPLETED = "completed"

class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(Integer,primary_key=True, index=True)
    animal_id: Mapped[int] = mapped_column(Integer, ForeignKey("animals.id"))
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    cost: Mapped[int] = mapped_column(Integer)
    current_amount: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[MilestoneStatus] = mapped_column(String, default=MilestoneStatus.PENDING)

    animal = relationship("Animal", back_populates="milestones")
