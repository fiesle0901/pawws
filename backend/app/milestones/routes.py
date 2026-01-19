from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.base import get_db
from app.milestones.models import Milestone, MilestoneStatus
from app.milestones.schemas import MilestoneCreate, MilestoneResponse, MilestoneDonate
from app.animals.models import Animal

router = APIRouter()

@router.post("/animals/{animal_id}/milestones", response_model=MilestoneResponse)
async def create_milestone(animal_id: int, milestone: MilestoneCreate, db: AsyncSession = Depends(get_db)):
    # Check if animal exists
    result = await db.execute(select(Animal).where(Animal.id == animal_id))
    if not result.scalar_one_or_none():
         raise HTTPException(status_code=404, detail="Animal not found")
    
    db_milestone = Milestone(**milestone.model_dump(), animal_id=animal_id)
    db.add(db_milestone)
    await db.commit()
    await db.refresh(db_milestone)
    return db_milestone

@router.post("/animals/{animal_id}/milestones/{milestone_id}/donate", response_model=MilestoneResponse)
async def donate_to_milestone(
    animal_id: int, 
    milestone_id: int, 
    donation: MilestoneDonate, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id, Milestone.animal_id == animal_id))
    db_milestone = result.scalar_one_or_none()
    if db_milestone is None:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    db_milestone.current_amount += donation.amount
    
    if db_milestone.current_amount >= db_milestone.cost:
        db_milestone.status = MilestoneStatus.FUNDED
        
    await db.commit()
    await db.refresh(db_milestone)
    return db_milestone
