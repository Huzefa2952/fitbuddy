# Shared Flask extensions for the FitBuddy backend.
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# Create extension instances that can be initialized from the app factory.
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
