# Placeholder routine routes for the FitBuddy starter project.
from flask import Blueprint

routine_bp = Blueprint("routine", __name__)


@routine_bp.get("/routines")
def get_routines():
    """Return a simple placeholder routine API response."""
    return {"message": "Routine API working"}
