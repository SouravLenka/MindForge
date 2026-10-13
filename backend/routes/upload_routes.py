# Upload routes for the backend
import os
import shutil
import traceback
from pathlib import Path
from uuid import uuid4
from typing import Dict, Any

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks

from backend.rag.document_loader import load_pdf
from backend.rag.text_splitter import split_documents
from backend.rag.embedding_model import get_embedding_model
from backend.rag.vector_store import create_vector_store

router = APIRouter()
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# In-memory job state is suitable for the current single-instance deployment.
# Jobs reset on restart; persistent job storage should be added with a database
# if multi-instance deployment is introduced.
indexing_jobs: Dict[str, Dict[str, Any]] = {}


def _index_pdf(job_id: str, file_path: Path):
    try:
        indexing_jobs[job_id] = {"status": "processing", "message": "Loading PDF and preparing text..."}
        documents = load_pdf(str(file_path))
        if not documents:
            raise ValueError("No readable text was found in this PDF.")
        chunks = split_documents(documents)
        if not chunks:
            raise ValueError("No text chunks could be created from this PDF.")

        indexing_jobs[job_id] = {
            "status": "processing",
            "message": f"Prepared {len(chunks)} text chunks. Initializing the embedding model...",
        }
        embedding_model = get_embedding_model()
        indexing_jobs[job_id] = {
            "status": "processing",
            "message": "Creating the searchable index. The first upload may take several minutes.",
        }
        create_vector_store(chunks, embedding_model)
        indexing_jobs[job_id] = {
            "status": "completed",
            "message": "PDF processed and indexed successfully.",
            "filename": file_path.name,
        }
        print(f"PDF indexing completed: {file_path.name} ({len(chunks)} chunks)")
    except Exception as exc:
        print(f"ERROR during indexing job {job_id}: {exc}")
        traceback.print_exc()
        indexing_jobs[job_id] = {
            "status": "failed",
            "message": f"Indexing failed: {str(exc)}",
        }


@router.post("/")
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    filename = Path(file.filename or "").name
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")
    if not contents.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="The selected file does not appear to be a valid PDF.")

    file_path = UPLOAD_DIR / f"{uuid4().hex}_{filename}"
    try:
        with open(file_path, "wb") as destination:
            destination.write(contents)
    except OSError as exc:
        raise HTTPException(status_code=500, detail="The server could not save this PDF.") from exc
    finally:
        await file.close()

    job_id = uuid4().hex
    indexing_jobs[job_id] = {"status": "queued", "message": "PDF uploaded. Waiting to start indexing..."}
    background_tasks.add_task(_index_pdf, job_id, file_path)
    return {
        "job_id": job_id,
        "status": "queued",
        "message": "PDF uploaded. Indexing is running in the background.",
    }


@router.get("/status/{job_id}")
def get_indexing_status(job_id: str):
    job = indexing_jobs.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Indexing job not found. It may have expired after a server restart.")
    return {"job_id": job_id, **job}


@router.get("/files")
def list_files():
    files = [f for f in os.listdir(UPLOAD_DIR) if f.lower().endswith(".pdf")]
    return {"files": files}
