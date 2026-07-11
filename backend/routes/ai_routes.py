# AI routes for FitBuddy.
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from ai_service import generate_ai_answer

ai_bp = Blueprint("ai", __name__)


@ai_bp.post("/ai/suggest")
@jwt_required()
def suggest_exercises():
    """Return beginner-friendly exercise suggestions from the exercise knowledge base."""
    data = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()

    if not question:
        return jsonify({"error": "Question is required"}), 400

    result = generate_ai_answer(question)
    return jsonify(result), 200
