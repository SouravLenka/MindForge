# Chat routes for the backend
# backend/routes/chat_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from rag.vector_store import get_vector_store
from rag.retriever import get_retriever
from rag.prompt_builder import build_prompt
from rag.response_generator import generate_response
from memory.conversation_memory import session_memory
from insights.tracker import insight_tracker


router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    explanation_mode: str
    difficulty_level: str


@router.post("/")
def ask_question(payload: QuestionRequest):

    vector_store = get_vector_store()

    if vector_store is None:
        raise HTTPException(status_code=400, detail="No syllabus uploaded yet.")

    retriever = get_retriever(vector_store)

    # Retrieve relevant documents
    docs = retriever.get_relevant_documents(payload.question)

    if not docs:
        return {
            "answer": "This topic is not covered in the provided syllabus materials. Please consult your instructor.",
            "source": "N/A",
            "limitation": "This answer is based only on the uploaded syllabus materials."
        }

    # Combine retrieved context
    context = "\n\n".join([doc.page_content for doc in docs])

    # Basic clarification detection (weak retrieval case)
    if len(context.strip()) < 50:
        return {
            "answer": "Could you clarify which chapter or concept you are referring to?",
            "source": "Clarification Requested",
            "limitation": "This answer is based only on the uploaded syllabus materials."
        }

    memory = session_memory.get_memory()
    chat_history = memory.load_memory_variables({}).get("chat_history", "")

    prompt = build_prompt(
        context=context,
        question=payload.question,
        explanation_mode=payload.explanation_mode,
        difficulty_level=payload.difficulty_level,
        chat_history=chat_history,
    )

    response_text = generate_response(prompt)

    # Update memory
    memory.save_context(
        {"input": payload.question},
        {"output": response_text}
    )

    # Log insight
    insight_tracker.log_question(payload.question, payload.explanation_mode)

    # Extract source metadata (basic)
    source = "Syllabus Document"

    return {
        "answer": response_text,
        "source": source,
        "limitation": "This answer is based only on the uploaded syllabus materials."
    }