from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from typing import List

from app.db.base import get_db
from app.animals.models import Animal
from app.animals.schemas import AnimalCreate, AnimalResponse

router = APIRouter()

@router.post("/", response_model=AnimalResponse)
async def create_animal(animal: AnimalCreate, db: AsyncSession = Depends(get_db)):
    db_animal = Animal(**animal.model_dump())
    db.add(db_animal)
    await db.commit()
    # Re-fetch the animal with milestones loaded to ensure response validation works
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).where(Animal.id == db_animal.id))
    db_animal = result.scalar_one()
    return db_animal

@router.get("/", response_model=List[AnimalResponse])
async def read_animals(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{animal_id}", response_model=AnimalResponse)
async def read_animal(animal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).where(Animal.id == animal_id))
    animal = result.scalar_one_or_none()
    if animal is None:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal
