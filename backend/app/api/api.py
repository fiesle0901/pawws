from fastapi import APIRouter
from app.animals import routes as animal_routes
from app.milestones import routes as milestone_routes

api_router = APIRouter()
api_router.include_router(animal_routes.router, prefix="/animals", tags=["animals"])
api_router.include_router(milestone_routes.router, tags=["milestones"])
