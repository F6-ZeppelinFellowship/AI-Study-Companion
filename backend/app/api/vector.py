from fastapi import APIRouter

from app.models.chunk import ChunkDTO
from app.services.vector_service import upsert_chunks

router = APIRouter(
    prefix="/vector",
    tags=["Vector DB"],
)


@router.post("/upsert")

def vector_upsert(chunks: list[ChunkDTO]):

    count = upsert_chunks(chunks)

    return {
        "status": "success",
        "vectors_uploaded": count,
    }
