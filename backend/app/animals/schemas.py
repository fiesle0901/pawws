from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.milestones.schemas import MilestoneResponse

class AnimalBase(BaseModel):
    name: str
    bio: Optional[str] = None
    status: str = "recovering"
    journey_story: Optional[str] = None
    image_url: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalUpdate(AnimalBase):
    name: Optional[str] = None
    status: Optional[str] = None

class AnimalResponse(AnimalBase):
    id: int
    admission_date: datetime
    milestones: List[MilestoneResponse] = []
    
    class Config:
        from_attributes = True

class AnimalListResponse(BaseModel):
    animals: List[AnimalResponse]
