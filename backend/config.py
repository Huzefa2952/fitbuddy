# Basic configuration values for the Flask backend.
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'fitbuddy.db')}")
SECRET_KEY = os.getenv("SECRET_KEY", "fitbuddy-dev-key")
SQLALCHEMY_DATABASE_URI = DATABASE_URL
SQLALCHEMY_TRACK_MODIFICATIONS = False
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fitbuddy-jwt-secret")
