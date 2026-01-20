from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from typing import List

from app.db.base import get_db
from app.animals.models import Animal
from app.animals.schemas import AnimalCreate, AnimalResponse

router = APIRouter()

import shutil
import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import Annotated

# ... existing imports

@router.post("/", response_model=AnimalResponse)
async def create_animal(
    name: Annotated[str, Form()],
    bio: Annotated[str, Form()],
    journey_story: Annotated[str, Form()],
    status: Annotated[str, Form()] = "recovering",
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db)
):
    image_url = None
    if image:
        upload_dir = Path("app/static/uploads")
        upload_dir.mkdir(parents=True, exist_ok=True)
        filename = f"{name.lower().replace(' ', '_')}_{image.filename}"
        file_path = upload_dir / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
            
        # Assuming the app is running on localhost:8000. In production, this should be configurable.
        image_url = f"http://localhost:8000/static/uploads/{filename}"
    else:
        image_url = None

    db_animal = Animal(
        name=name,
        bio=bio,
        journey_story=journey_story,
        status=status,
        image_url=image_url
    )
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
