from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

COLLECTION_NAME = "study_chunks"

client = QdrantClient(
    host="localhost",
    port=6333,
)


def initialize_collection(vector_size: int):

    collections = [
        c.name for c in client.get_collections().collections
    ]

    if COLLECTION_NAME not in collections:

        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE,
            ),
        )
