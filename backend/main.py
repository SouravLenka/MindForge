import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.chat_routes import router as chat_router
from backend.routes.upload_routes import router as upload_router
from backend.routes.insight_routes import router as insight_router

app = FastAPI(title="MindForge API")

# The frontend is hosted separately on Vercel. Keep the explicit frontend URL
# configurable, while also allowing Vercel preview/production subdomains.
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in frontend_url.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://([a-zA-Z0-9-]+\.)*vercel\.app",
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


@app.get("/health")
def health():
    return {"status": "ok"}
