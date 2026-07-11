# Workout routine routes for the FitBuddy app.
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models.exercise import Exercise
from models.routine import RoutineExercise, WorkoutRoutine
from models.user import User

routine_bp = Blueprint("routine", __name__)


@routine_bp.get("/routines")
@jwt_required()
def get_routines():
    """Return all routines for the logged-in user."""
    user_id = int(get_jwt_identity())
    routines = WorkoutRoutine.query.filter_by(user_id=user_id).order_by(WorkoutRoutine.id.desc()).all()
    return jsonify([routine.to_dict() for routine in routines]), 200


@routine_bp.post("/routines")
@jwt_required()
def create_routine():
    """Create a new workout routine for the logged-in user."""
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()

    if not name:
        return jsonify({"error": "Routine name is required"}), 400

    user_id = int(get_jwt_identity())
    routine = WorkoutRoutine(name=name, user_id=user_id)
    db.session.add(routine)
    db.session.commit()

    return jsonify(routine.to_dict()), 201


@routine_bp.put("/routines/<int:routine_id>")
@jwt_required()
def update_routine(routine_id):
    """Update the name of a routine owned by the logged-in user."""
    user_id = int(get_jwt_identity())
    routine = WorkoutRoutine.query.filter_by(id=routine_id, user_id=user_id).first()

    if not routine:
        return jsonify({"error": "Routine not found"}), 404

    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "Routine name is required"}), 400

    routine.name = name
    db.session.commit()
    return jsonify(routine.to_dict()), 200


@routine_bp.delete("/routines/<int:routine_id>")
@jwt_required()
def delete_routine(routine_id):
    """Delete a routine owned by the logged-in user."""
    user_id = int(get_jwt_identity())
    routine = WorkoutRoutine.query.filter_by(id=routine_id, user_id=user_id).first()

    if not routine:
        return jsonify({"error": "Routine not found"}), 404

    db.session.delete(routine)
    db.session.commit()
    return jsonify({"message": "Routine deleted"}), 200


@routine_bp.post("/routines/<int:routine_id>/exercise")
@jwt_required()
def add_exercise_to_routine(routine_id):
    """Attach an exercise to a routine."""
    user_id = int(get_jwt_identity())
    routine = WorkoutRoutine.query.filter_by(id=routine_id, user_id=user_id).first()

    if not routine:
        return jsonify({"error": "Routine not found"}), 404

    data = request.get_json(silent=True) or {}
    exercise_id = data.get("exercise_id")
    if not exercise_id:
        return jsonify({"error": "Exercise id is required"}), 400

    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    exists = RoutineExercise.query.filter_by(routine_id=routine.id, exercise_id=exercise.id).first()
    if exists:
        return jsonify({"error": "Exercise already added to this routine"}), 400

    link = RoutineExercise(routine_id=routine.id, exercise_id=exercise.id)
    db.session.add(link)
    db.session.commit()

    return jsonify(routine.to_dict()), 201


@routine_bp.delete("/routines/<int:routine_id>/exercise/<int:exercise_id>")
@jwt_required()
def remove_exercise_from_routine(routine_id, exercise_id):
    """Remove an exercise from a routine."""
    user_id = int(get_jwt_identity())
    routine = WorkoutRoutine.query.filter_by(id=routine_id, user_id=user_id).first()

    if not routine:
        return jsonify({"error": "Routine not found"}), 404

    link = RoutineExercise.query.filter_by(routine_id=routine.id, exercise_id=exercise_id).first()
    if not link:
        return jsonify({"error": "Exercise not found in routine"}), 404

    db.session.delete(link)
    db.session.commit()
    return jsonify(routine.to_dict()), 200
