from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.generator import router as generator_router

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

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "AI Study Companion API."}