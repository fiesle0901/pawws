from pydantic import BaseModel
from typing import Optional
from app.milestones.models import MilestoneStatus

class MilestoneBase(BaseModel):
    title: str
    description: Optional[str] = None
    cost: int
    current_amount: int = 0
    status: MilestoneStatus = MilestoneStatus.PENDING

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneDonate(BaseModel):
    amount: int

class MilestoneResponse(MilestoneBase):
    id: int
    animal_id: int
    
    class Config:
        from_attributes = True
