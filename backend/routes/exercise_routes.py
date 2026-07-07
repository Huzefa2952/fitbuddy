# Placeholder exercise routes for the FitBuddy starter project.
from flask import Blueprint

exercise_bp = Blueprint("exercise", __name__)


@exercise_bp.get("/exercises")
def get_exercises():
    """Return a simple placeholder exercise API response."""
    return {"message": "Exercise API working"}
