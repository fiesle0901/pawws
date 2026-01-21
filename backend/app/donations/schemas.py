from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.donations.models import DonationStatus

class DonationCreate(BaseModel):
    milestone_id: int
    amount: int

class DonationResponse(BaseModel):
    id: int
    milestone_id: int
    user_id: Optional[int]
    amount: int
    status: DonationStatus
    created_at: datetime
    
    proof_url: Optional[str] = None
    animal_name: Optional[str] = None
    animal_id: Optional[int] = None

    class Config:
        from_attributes = True

class DonationUpdateStatus(BaseModel):
    status: DonationStatus

class AdminQRResponse(BaseModel):
    qr_url: str

