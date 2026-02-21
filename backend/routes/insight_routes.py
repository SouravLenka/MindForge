# Insight routes for the backend
# backend/routes/insight_routes.py

from fastapi import APIRouter
from backend.insights.tracker import insight_tracker

router = APIRouter()


@router.get("/")
def get_insights():
    return insight_tracker.get_insights()