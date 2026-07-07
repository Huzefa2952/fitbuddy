import os
import re
import socket
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableSerializable
from langchain_ollama import ChatOllama, OllamaEmbeddings

from models.exercise import Exercise

VECTOR_STORE_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
OLLAMA_EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "fitbuddy_exercises")

_vector_store: Optional[Chroma] = None
_vector_store_ready = False

MUSCLE_KEYWORDS = {
    "chest": {"chest", "push", "pushup", "push-up", "bench", "pec"},
    "back": {"back", "pull", "pullup", "pull-up", "row", "lat", "lats"},
    "shoulders": {"shoulder", "shoulders", "delt", "delts", "press"},
    "legs": {"leg", "legs", "quad", "quads", "hamstring", "hamstrings", "calf", "calves", "squat", "lunge"},
    "arms": {"arm", "arms", "bicep", "biceps", "tricep", "triceps", "curl"},
    "core": {"core", "abs", "ab", "plank", "stomach"},
    "glutes": {"glute", "glutes", "hip"},
    "full body": {"full", "body", "conditioning", "cardio"},
}

DIFFICULTY_KEYWORDS = {
    "Beginner": {"beginner", "easy", "new", "start", "starter", "simple"},
    "Intermediate": {"intermediate", "moderate"},
    "Advanced": {"advanced", "hard", "difficult", "expert"},
}


def _tokenize(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)?", text.lower()))


def _build_exercise_documents() -> List[Document]:
    exercises = Exercise.query.order_by(Exercise.name).all()
    documents = []

    for exercise in exercises:
        content = (
            f"Name: {exercise.name}\n"
            f"Muscle group: {exercise.muscle_group}\n"
            f"Difficulty: {exercise.difficulty}\n"
            f"Description: {exercise.description}"
        )
        documents.append(
            Document(
                page_content=content,
                metadata={
                    "id": exercise.id,
                    "name": exercise.name,
                    "muscle_group": exercise.muscle_group,
                    "difficulty": exercise.difficulty,
                },
            )
        )

    return documents


def _ollama_is_available() -> bool:
    parsed_url = urlparse(OLLAMA_BASE_URL)
    host = parsed_url.hostname or "localhost"
    port = parsed_url.port or (443 if parsed_url.scheme == "https" else 80)

    try:
        with socket.create_connection((host, port), timeout=0.5):
            return True
    except OSError:
        return False


def initialize_vector_store(force_rebuild: bool = False) -> bool:
    """Initialize the Chroma vector store when Ollama embeddings are available."""
    global _vector_store, _vector_store_ready

    if _vector_store_ready and _vector_store is not None and not force_rebuild:
        return True

    if not _ollama_is_available():
        _vector_store = None
        _vector_store_ready = False
        return False

    documents = _build_exercise_documents()
    if not documents:
        _vector_store = None
        _vector_store_ready = False
        return False

    try:
        embeddings = OllamaEmbeddings(model=OLLAMA_EMBEDDING_MODEL, base_url=OLLAMA_BASE_URL)
        _vector_store = Chroma.from_documents(
            documents=documents,
            collection_name=CHROMA_COLLECTION,
            persist_directory=VECTOR_STORE_DIR,
            embedding=embeddings,
        )
        _vector_store_ready = True
        return True
    except Exception:
        _vector_store = None
        _vector_store_ready = False
        return False


def get_vector_store() -> Optional[Chroma]:
    if _vector_store is None:
        initialize_vector_store()
    return _vector_store


def _score_exercise(exercise: Exercise, question_tokens: set[str]) -> int:
    name_tokens = _tokenize(exercise.name)
    group_tokens = _tokenize(exercise.muscle_group)
    difficulty_tokens = _tokenize(exercise.difficulty)
    description_tokens = _tokenize(exercise.description)

    score = 0
    score += 6 * len(question_tokens & name_tokens)
    score += 5 * len(question_tokens & group_tokens)
    score += 3 * len(question_tokens & difficulty_tokens)
    score += len(question_tokens & description_tokens)

    group_key = exercise.muscle_group.lower()
    if question_tokens & MUSCLE_KEYWORDS.get(group_key, set()):
        score += 15

    for difficulty, keywords in DIFFICULTY_KEYWORDS.items():
        if exercise.difficulty == difficulty and question_tokens & keywords:
            score += 5

    if exercise.difficulty == "Beginner" and question_tokens & DIFFICULTY_KEYWORDS["Beginner"]:
        score += 3

    return score


def _exercise_to_result(exercise: Exercise) -> Dict[str, Any]:
    content = (
        f"Name: {exercise.name}\n"
        f"Muscle group: {exercise.muscle_group}\n"
        f"Difficulty: {exercise.difficulty}\n"
        f"Description: {exercise.description}"
    )
    return {
        "id": exercise.id,
        "name": exercise.name,
        "muscle_group": exercise.muscle_group,
        "difficulty": exercise.difficulty,
        "description": exercise.description,
        "content": content,
    }


def _fallback_exercise_search(question: str, limit: int) -> List[Dict[str, Any]]:
    question_tokens = _tokenize(question)
    exercises = Exercise.query.order_by(Exercise.name).all()
    if not exercises:
        return []

    scored = [(_score_exercise(exercise, question_tokens), exercise) for exercise in exercises]
    scored.sort(key=lambda item: (-item[0], item[1].difficulty != "Beginner", item[1].name))

    best_score = scored[0][0]
    minimum_relevant_score = max(1, best_score * 0.5)
    matches = [exercise for score, exercise in scored if score >= minimum_relevant_score]
    if not matches:
        matches = [exercise for exercise in exercises if exercise.difficulty == "Beginner"]

    return [_exercise_to_result(exercise) for exercise in matches[:limit]]


def get_relevant_exercises(question: str, limit: int = 4) -> List[Dict[str, Any]]:
    vector_store = get_vector_store()
    if vector_store is not None:
        try:
            docs = vector_store.similarity_search(question, k=limit)
            if docs:
                return [
                    {
                        "id": doc.metadata.get("id"),
                        "name": doc.metadata.get("name") or doc.page_content.splitlines()[0].replace("Name: ", ""),
                        "muscle_group": doc.metadata.get("muscle_group"),
                        "difficulty": doc.metadata.get("difficulty"),
                        "content": doc.page_content,
                    }
                    for doc in docs
                ]
        except Exception:
            pass

    return _fallback_exercise_search(question, limit)


def _build_fallback_answer(question: str, exercises: List[Dict[str, Any]]) -> str:
    selected = exercises
    exercise_names = ", ".join(exercise["name"] for exercise in selected[:3])

    if not exercise_names:
        return "No exercise information is available yet. Please seed the exercise library and try again."

    lower_question = question.lower()
    if "chest" in lower_question:
        focus = "For a beginner chest workout"
    elif "back" in lower_question:
        focus = "For a beginner back workout"
    elif "leg" in lower_question or "glute" in lower_question:
        focus = "For a beginner lower-body workout"
    elif "core" in lower_question or "abs" in lower_question:
        focus = "For beginner core training"
    else:
        focus = "For a beginner-friendly workout"

    return (
        f"{focus}, start with {exercise_names}. "
        "Use light resistance or bodyweight first, keep each rep controlled, and stop if form breaks down. "
        "Try 2-3 sets of 8-12 reps for strength moves, or 20-30 seconds for holds like planks. "
        "Rest about a minute between sets and add difficulty gradually as the exercises feel easier."
    )


def generate_ai_answer(question: str) -> Dict[str, Any]:
    relevant_exercises = get_relevant_exercises(question)
    if not relevant_exercises:
        return {
            "answer": "No exercise information is available yet. Please make sure the exercise library has been seeded.",
            "sources": [],
        }

    context_text = "\n\n".join(f"- {item['content']}" for item in relevant_exercises)
    prompt = PromptTemplate.from_template(
        "You are FitBuddy's helpful fitness assistant. Use only the exercise context below to answer the user's question. "
        "Keep the answer beginner-friendly, practical, and safe. Do not diagnose injuries or medical conditions.\n\n"
        "User question: {question}\n\n"
        "Exercise context:\n{context}\n\n"
        "Answer in 3-6 sentences. Mention the exercise names you used."
    )

    if _ollama_is_available():
        try:
            llm = ChatOllama(model=OLLAMA_MODEL, base_url=OLLAMA_BASE_URL, temperature=0.2)
            chain: RunnableSerializable = prompt | llm | StrOutputParser()
            answer = chain.invoke({"question": question, "context": context_text})
            if isinstance(answer, str) and answer.strip():
                return {
                    "answer": answer.strip(),
                    "sources": [item["name"] for item in relevant_exercises],
                    "mode": "ollama",
                }
        except Exception:
            pass

    return {
        "answer": _build_fallback_answer(question, relevant_exercises),
        "sources": [item["name"] for item in relevant_exercises],
        "mode": "local",
    }
