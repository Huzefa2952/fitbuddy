# Exercise routes for the FitBuddy app.
from flask import Blueprint, jsonify

from extensions import db
from models.exercise import Exercise

exercise_bp = Blueprint("exercise", __name__)


@exercise_bp.get("/exercises")
def get_exercises():
    """Return all exercises from the library."""
    exercises = Exercise.query.order_by(Exercise.name).all()
    return jsonify([exercise.to_dict() for exercise in exercises]), 200


@exercise_bp.get("/exercises/<int:exercise_id>")
def get_exercise(exercise_id):
    """Return one exercise by id."""
    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    return jsonify(exercise.to_dict()), 200
