from qdrant_client.models import PointStruct

from app.core.embedding_service import create_embedding
from app.core.qdrant_client import (
    client,
    COLLECTION_NAME,
    initialize_collection,
)

from app.models.chunk import ChunkDTO


def upsert_chunks(chunks: list[ChunkDTO]):

    embeddings = [
        create_embedding(chunk.text)
        for chunk in chunks
    ]

    initialize_collection(len(embeddings[0]))

    points = []

    for idx, chunk in enumerate(chunks):

        points.append(

            PointStruct(
                id=idx,
                vector=embeddings[idx],
                payload={
                    "chunk_id": chunk.chunk_id,
                    "source_file": chunk.source_file,
                    "page_number": chunk.page_number,
                    "token_count": chunk.token_count,
                    "text": chunk.text,
                },
            )

        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    return len(points)
