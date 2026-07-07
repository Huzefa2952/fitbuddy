# Workout routine and routine-exercise models for the FitBuddy app.
from extensions import db
from models.user import User
from models.exercise import Exercise


class WorkoutRoutine(db.Model):
    """Represents a workout routine created by a user."""
    __tablename__ = "workout_routines"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", backref=db.backref("routines", lazy=True))
    routine_exercises = db.relationship(
        "RoutineExercise",
        backref="routine",
        cascade="all, delete-orphan",
        lazy=True,
    )

    def to_dict(self):
        """Return a JSON-friendly dictionary including related exercises."""
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "exercises": [item.to_dict() for item in self.routine_exercises],
        }


class RoutineExercise(db.Model):
    """Links a workout routine to an exercise."""
    __tablename__ = "routine_exercises"

    id = db.Column(db.Integer, primary_key=True)
    routine_id = db.Column(db.Integer, db.ForeignKey("workout_routines.id"), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.id"), nullable=False)

    exercise = db.relationship("Exercise", backref=db.backref("routine_links", lazy=True))

    def to_dict(self):
        """Return a JSON-friendly dictionary for the linked exercise."""
        return {
            "id": self.id,
            "exercise_id": self.exercise_id,
            "name": self.exercise.name,
            "muscle_group": self.exercise.muscle_group,
            "difficulty": self.exercise.difficulty,
            "description": self.exercise.description,
        }
