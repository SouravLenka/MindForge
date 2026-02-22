# Chat routes for the backend
# backend/routes/chat_routes.py

import traceback
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.rag.vector_store import get_vector_store
from backend.rag.retriever import get_retriever
from backend.rag.prompt_builder import build_prompt
from backend.rag.response_generator import generate_response
from backend.memory.conversation_memory import session_memory
from backend.insights.tracker import insight_tracker


router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    explanation_mode: str
    difficulty_level: str
    language: str = "English"


@router.post("/")
def ask_question(payload: QuestionRequest):
    print(f"--- Recieved ask doubt request: {payload.question} ---")
    try:
        vector_store = get_vector_store()

        if vector_store is None:
            print("Vector store is None - no syllabus uploaded")
            raise HTTPException(status_code=400, detail="No syllabus uploaded yet.")

        print("Initializing retriever...")
        retriever = get_retriever(vector_store)

        # Retrieve relevant documents
        print("Retrieving relevant documents...")
        docs = retriever.invoke(payload.question)
        print(f"Retrieved {len(docs)} documents")

        if not docs:
            return {
                "answer": "This topic is not covered in the provided syllabus materials./n Please take the help of external resources.",
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

        print("Loading conversation memory...")
        memory = session_memory.get_memory()
        chat_history = memory.load_memory_variables({}).get("chat_history", "")

        print("Building prompt...")
        prompt = build_prompt(
            context=context,
            question=payload.question,
            explanation_mode=payload.explanation_mode,
            difficulty_level=payload.difficulty_level,
            language=payload.language,
            chat_history=chat_history,
        )

        print("Generating response from model...")
        response_text = generate_response(prompt)
        print("Response generated successfully")

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
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR during chat processing: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Doubt resolution failed: {str(e)}")