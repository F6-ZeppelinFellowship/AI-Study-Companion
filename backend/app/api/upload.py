from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.chunk import IngestUploadResponse
from app.services.chunker import extract_text_by_page, chunk_text

router = APIRouter(prefix="/ingest", tags=["ingestion"])

@router.post("/upload",
             response_model=IngestUploadResponse,
             status_code=status.HTTP_200_OK,
             summary="Upload a PDF or TXT document and receive chunked text with metadata.",
             description="Extracts raw text from the uploaded file and splits it into token-aware overlapping chunks for downstream embedding.")
async def upload_document(file: UploadFile = File(...)) -> IngestUploadResponse:
    if not file.filename.lower().endswith((".pdf", ".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .pdf and .txt files are supported."
        )
    try:
        file_bytes = await file.read()
        pages = extract_text_by_page(file_bytes, file.filename)

        if not pages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No extractable text found in the uploaded file."
            )

        chunks = chunk_text(pages, file.filename)

        return IngestUploadResponse(
            source_file=file.filename,
            total_chunks=len(chunks),
            chunks=chunks
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}"
        )