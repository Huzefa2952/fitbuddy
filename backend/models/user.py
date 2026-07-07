# User model for the FitBuddy authentication starter.
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


class User(db.Model):
    """Store the basic user information for authentication."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        """Hash a plain-text password before saving it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify a submitted password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Return a simple public dictionary representation of the user."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
        }
