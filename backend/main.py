from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.generator import router as generator_router
from app.api.upload import router as upload_router

app = FastAPI(
    title="AI Study Companion API",
    version="1.0.0",
    description="Backend API for AI Study Companion — Ingestion, Vector DB, Retrieval & LLM Generation"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generator_router, prefix="/api")
app.include_router(upload_router, prefix="/api/v1")

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Study Companion API."}