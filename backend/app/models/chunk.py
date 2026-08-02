from pydantic import BaseModel, Field
from typing import List

class ChunkDTO(BaseModel):
    chunk_id: str = Field(description="Unique identifier for this chunk, e.g. doc_01_chunk_03")
    source_file: str = Field(description="Original filename the chunk was extracted from")
    text: str = Field(description="Raw text content of the chunk")
    token_count: int = Field(description="Approximate number of tokens in this chunk")
    page_number: int = Field(default=1, description="Page number the chunk originated from")

class IngestUploadResponse(BaseModel):
    source_file: str = Field(description="Name of the uploaded file")
    total_chunks: int = Field(description="Total number of chunks generated")
    chunks: List[ChunkDTO] = Field(description="List of structured chunk objects")