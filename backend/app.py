# Main Flask application entry point for the FitBuddy starter project.
from flask import Flask
from flask_cors import CORS

from extensions import db, jwt, migrate
from routes.auth_routes import auth_bp
from routes.exercise_routes import exercise_bp
from routes.routine_routes import routine_bp
from routes.ai_routes import ai_bp


def create_app():
    """Build and configure the Flask app for FitBuddy."""
    app = Flask(__name__)
    app.config.from_object("config")

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(exercise_bp, url_prefix="/api")
    app.register_blueprint(routine_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
