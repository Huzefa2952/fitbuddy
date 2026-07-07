# Placeholder AI routes for the FitBuddy starter project.
from flask import Blueprint

ai_bp = Blueprint("ai", __name__)


@ai_bp.get("/ai")
def ai_status():
    """Return a simple placeholder AI API response."""
    return {"message": "AI API working"}
