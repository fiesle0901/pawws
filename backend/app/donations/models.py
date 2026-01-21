from sqlalchemy import Integer, String, Enum, LargeBinary, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from app.db.base import Base

class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    milestone_id: Mapped[int] = mapped_column(Integer, ForeignKey("milestones.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    amount: Mapped[int] = mapped_column(Integer)
    status: Mapped[DonationStatus] = mapped_column(String, default=DonationStatus.PENDING)
    

    proof_image_data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    proof_content_type: Mapped[str] = mapped_column(String, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    
    milestone = relationship("Milestone", lazy="joined") 

class AdminQR(Base):
    __tablename__ = "admin_qr"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    image_data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    image_content_type: Mapped[str] = mapped_column(String, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
