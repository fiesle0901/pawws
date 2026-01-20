from fastapi import APIRouter
from app.animals import routes as animal_routes
from app.milestones import routes as milestone_routes
from app.donations import routes as donation_routes

from app.auth import routes as auth_routes

api_router = APIRouter()
api_router.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
api_router.include_router(animal_routes.router, prefix="/animals", tags=["animals"])
api_router.include_router(milestone_routes.router, tags=["milestones"])
api_router.include_router(donation_routes.router, prefix="/donations", tags=["donations"])
