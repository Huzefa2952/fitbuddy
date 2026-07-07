# Exercise model for the FitBuddy app.
from extensions import db


class Exercise(db.Model):
    """Represents a fitness exercise that can be shown in the library."""
    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    muscle_group = db.Column(db.String(80), nullable=False)
    difficulty = db.Column(db.String(40), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def to_dict(self):
        """Return a JSON-friendly dictionary for the API."""
        return {
            "id": self.id,
            "name": self.name,
            "muscle_group": self.muscle_group,
            "difficulty": self.difficulty,
            "description": self.description,
        }
