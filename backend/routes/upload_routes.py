# Upload routes for the backend
# backend/routes/upload_routes.py

import os
import traceback
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path

from backend.rag.document_loader import load_pdf
from backend.rag.text_splitter import split_documents
from backend.rag.embedding_model import get_embedding_model
from backend.rag.vector_store import create_vector_store

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):
    print(f"--- Recieved upload request: {file.filename} ---")
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = UPLOAD_DIR / file.filename

    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
        print(f"File saved to {file_path}")

        # Load and process PDF
        print("Loading PDF...")
        documents = load_pdf(str(file_path))
        print(f"Loaded {len(documents)} pages")

        print("Splitting documents...")
        chunks = split_documents(documents)
        print(f"Created {len(chunks)} chunks")

        print("Retrieving embedding model...")
        embedding_model = get_embedding_model()

        print("Creating vector store...")
        create_vector_store(chunks, embedding_model)
        print("Vector store created successfully")

        return {"message": "PDF processed and indexed successfully."}
    except Exception as e:
        print(f"ERROR during indexing: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")


@router.get("/files")
async def list_files():
    files = [f for f in os.listdir(UPLOAD_DIR) if f.endswith(".pdf")]
    return {"files": files}