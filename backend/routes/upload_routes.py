# Upload routes for the backend
# backend/routes/upload_routes.py

import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path

from rag.document_loader import load_pdf
from rag.text_splitter import split_documents
from rag.embedding_model import get_embedding_model
from rag.vector_store import create_vector_store

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Load and process PDF
    documents = load_pdf(str(file_path))
    chunks = split_documents(documents)
    embedding_model = get_embedding_model()

    create_vector_store(chunks, embedding_model)

    return {"message": "PDF processed and indexed successfully."}