from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import joinedload
from app.db.base import get_db
from app.auth.deps import get_current_user, get_current_active_superuser
from app.auth.models import User
from app.donations.models import Donation, DonationStatus, AdminQR
from app.donations.schemas import DonationCreate, DonationResponse, DonationUpdateStatus
from app.milestones.models import Milestone, MilestoneStatus
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=DonationResponse)
async def create_donation(
    milestone_id: Annotated[int, Form()],
    amount: Annotated[int, Form()],
    proof: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")


    proof_data = await proof.read()
    
    donation = Donation(
        milestone_id=milestone_id,
        user_id=current_user.id,
        amount=amount,
        proof_image_data=proof_data,
        proof_content_type=proof.content_type,
        status=DonationStatus.PENDING
    )
    db.add(donation)
    await db.commit()
    await db.refresh(donation)
    
    donation.proof_url = f"{settings.BASE_URL}/donations/{donation.id}/proof"
    return donation

@router.get("/my", response_model=List[DonationResponse])
async def list_my_donations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Donation)
        .options(joinedload(Donation.milestone).joinedload(Milestone.animal))
        .where(Donation.user_id == current_user.id)
        .order_by(desc(Donation.created_at))
    )
    donations = result.scalars().all()
    
    for d in donations:
        d.proof_url = f"{settings.BASE_URL}/donations/{d.id}/proof"
        if d.milestone and d.milestone.animal:
            d.animal_name = d.milestone.animal.name
            d.animal_id = d.milestone.animal.id
            
    return donations

@router.get("/qr")
async def get_admin_qr(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminQR).limit(1))
    qr = result.scalar_one_or_none()
    
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not set")
    
    return Response(content=qr.image_data, media_type=qr.image_content_type)

@router.get("/", response_model=List[DonationResponse])
async def list_donations(
    skip: int = 0, 
    limit: int = 100, 
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Donation)
        .options(joinedload(Donation.milestone).joinedload(Milestone.animal))
        .order_by(desc(Donation.created_at))
        .offset(skip)
        .limit(limit)
    )
    donations = result.scalars().all()
    
    for d in donations:
        d.proof_url = f"{settings.BASE_URL}/donations/{d.id}/proof"
        if d.milestone and d.milestone.animal:
            d.animal_name = d.milestone.animal.name
            d.animal_id = d.milestone.animal.id
        
    return donations

@router.get("/{donation_id}/proof")
async def get_donation_proof(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        

    if current_user.role != "admin" and donation.user_id != current_user.id:
         raise HTTPException(status_code=403, detail="Not authorized")

    return Response(content=donation.proof_image_data, media_type=donation.proof_content_type)

@router.put("/{donation_id}/status", response_model=DonationResponse)
async def update_donation_status(
    donation_id: int,
    status_update: DonationUpdateStatus,
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = result.scalar_one_or_none()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    if status_update.status == DonationStatus.APPROVED and donation.status != DonationStatus.APPROVED:
        m_result = await db.execute(select(Milestone).where(Milestone.id == donation.milestone_id))
        milestone = m_result.scalar_one()
        
        milestone.current_amount += donation.amount
        if milestone.current_amount >= milestone.cost:
            milestone.status = MilestoneStatus.FUNDED
            
    donation.status = status_update.status
    await db.commit()
    await db.refresh(donation)
    
    donation.proof_url = f"{settings.BASE_URL}/donations/{donation.id}/proof"
    return donation

@router.post("/admin/qr")
async def upload_admin_qr(
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_active_superuser),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AdminQR).limit(1))
    qr = result.scalar_one_or_none()
    
    image_data = await image.read()
    
    if qr:
        qr.image_data = image_data
        qr.image_content_type = image.content_type
    else:
        qr = AdminQR(image_data=image_data, image_content_type=image.content_type)
        db.add(qr)
        
    await db.commit()
    return {"message": "QR code updated"}
