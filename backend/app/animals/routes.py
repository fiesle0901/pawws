from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.db.base import get_db
from app.animals.models import Animal
from app.animals.schemas import AnimalCreate, AnimalResponse
from app.core.config import settings

router = APIRouter()


@router.post("/", response_model=AnimalResponse)
async def create_animal(
    name: Annotated[str, Form()],
    bio: Annotated[str, Form()],
    journey_story: Annotated[str, Form()],
    status: Annotated[str, Form()] = "recovering",
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db)
):
    image_data = None
    image_content_type = None
    
    if image:
        image_data = await image.read()
        image_content_type = image.content_type

    db_animal = Animal(
        name=name,
        bio=bio,
        journey_story=journey_story,
        status=status,
        image_data=image_data,
        image_content_type=image_content_type
    )
    db.add(db_animal)
    await db.commit()
    
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).where(Animal.id == db_animal.id))
    db_animal = result.scalar_one()
    
    if db_animal.image_data:
        db_animal.image_url = f"{settings.BASE_URL}/animals/{db_animal.id}/image"
        
    return db_animal

@router.put("/{animal_id}", response_model=AnimalResponse)
async def update_animal(
    animal_id: int,
    name: Annotated[str, Form()] = None,
    bio: Annotated[str, Form()] = None,
    journey_story: Annotated[str, Form()] = None,
    status: Annotated[str, Form()] = None,
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).where(Animal.id == animal_id))
    db_animal = result.scalar_one_or_none()
    
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    if name is not None:
        db_animal.name = name
    if bio is not None:
        db_animal.bio = bio
    if journey_story is not None:
        db_animal.journey_story = journey_story
    if status is not None:
        db_animal.status = status
        
    if image:
        db_animal.image_data = await image.read()
        db_animal.image_content_type = image.content_type

    await db.commit()
    await db.refresh(db_animal)
    
    if db_animal.image_data:
        db_animal.image_url = f"{settings.BASE_URL}/animals/{db_animal.id}/image"
        
    return db_animal

@router.get("/{animal_id}/image")
async def get_animal_image(animal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).where(Animal.id == animal_id))
    animal = result.scalar_one_or_none()
    
    if not animal or not animal.image_data:
        raise HTTPException(status_code=404, detail="Image not found")
        
    from fastapi.responses import Response
    return Response(content=animal.image_data, media_type=animal.image_content_type)

@router.get("/", response_model=List[AnimalResponse])
async def read_animals(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).offset(skip).limit(limit))
    animals = result.scalars().all()
    
    for animal in animals:
        if animal.image_data:
            animal.image_url = f"{settings.BASE_URL}/animals/{animal.id}/image"
        else:
            animal.image_url = None
            
    return animals

@router.get("/{animal_id}", response_model=AnimalResponse)
async def read_animal(animal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).options(selectinload(Animal.milestones)).where(Animal.id == animal_id))
    animal = result.scalar_one_or_none()
    
    if animal is None:
        raise HTTPException(status_code=404, detail="Animal not found")
        
    if animal.image_data:
        animal.image_url = f"{settings.BASE_URL}/animals/{animal.id}/image"
    else:
        animal.image_url = None
        
    return animal
