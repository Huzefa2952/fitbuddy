import os
from typing import List, Dict, Any

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableSerializable
from langchain_ollama import ChatOllama

from models.exercise import Exercise

VECTOR_STORE_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "fitbuddy_exercises")

_vector_store = None


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
        documents.append(Document(page_content=content, metadata={"name": exercise.name}))
    return documents


def initialize_vector_store() -> None:
    global _vector_store
    if _vector_store is not None:
        return

    documents = _build_exercise_documents()
    if not documents:
        _vector_store = None
        return

    try:
        _vector_store = Chroma.from_documents(
            documents=documents,
            collection_name=CHROMA_COLLECTION,
            persist_directory=VECTOR_STORE_DIR,
            embedding_function=None,
        )
    except Exception:
        _vector_store = None


def get_vector_store():
    if _vector_store is None:
        initialize_vector_store()
    return _vector_store


def get_relevant_exercises(question: str, limit: int = 4) -> List[Dict[str, Any]]:
    vector_store = get_vector_store()
    if vector_store is None:
        return []

    try:
        docs = vector_store.similarity_search(question, k=limit)
    except Exception:
        return []

    results = []
    for doc in docs:
        results.append({
            "name": doc.metadata.get("name") or doc.page_content.splitlines()[0].replace("Name: ", ""),
            "content": doc.page_content,
        })
    return results


def generate_ai_answer(question: str) -> Dict[str, Any]:
    relevant_exercises = get_relevant_exercises(question)
    if not relevant_exercises:
        return {
            "answer": "No exercise information is available yet. Please make sure the exercise library has been seeded.",
            "sources": [],
        }

    context_text = "\n\n".join(
        f"- {item['name']}: {item['content']}" for item in relevant_exercises
    )

    prompt = PromptTemplate.from_template(
        "You are a helpful fitness assistant. Use the exercise context below to answer the user's question. "
        "Keep the answer short, beginner-friendly, and practical.\n\n"
        "User question: {question}\n\n"
        "Exercise context:\n{context}\n\n"
        "Answer in 3-6 sentences and mention the exercise names from the context."
    )

    try:
        llm = ChatOllama(model=OLLAMA_MODEL, base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"), temperature=0.2)
        chain: RunnableSerializable = prompt | llm | StrOutputParser()
        answer = chain.invoke({"question": question, "context": context_text})
        if isinstance(answer, str) and answer.strip():
            return {
                "answer": answer.strip(),
                "sources": [item["name"] for item in relevant_exercises],
            }
    except Exception:
        pass

    names = ", ".join(item["name"] for item in relevant_exercises)
    return {
        "answer": (
            f"Based on the exercise library, I would start with {names}. "
            "Choose movements that feel comfortable, keep your form simple, and build up gradually."
        ),
        "sources": [item["name"] for item in relevant_exercises],
    }
