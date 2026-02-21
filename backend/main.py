# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.chat_routes import router as chat_router
from backend.routes.upload_routes import router as upload_router
from backend.routes.insight_routes import router as insight_router

app = FastAPI(title="MindForge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/upload")
app.include_router(chat_router, prefix="/ask")
app.include_router(insight_router, prefix="/insights")


@app.get("/")
def health_check():
    return {"status": "MindForge Backend Running"}