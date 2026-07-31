import pdfplumber
from io import BytesIO
from app.models.chunk import ChunkDTO

CHUNK_MIN_TOKENS = 200
CHUNK_MAX_TOKENS = 500
OVERLAP_RATIO = 0.10

def _estimate_tokens(text: str) -> int:
    """Approximate token count using word count (1 word ~ 1.3 tokens)."""
    return int(len(text.split()) * 1.3)

def extract_text_by_page(file_bytes: bytes, filename: str) -> list[tuple[str, int]]:
    """Extract raw text from PDF or TXT, returns list of (text, page_number)."""
    if filename.lower().endswith(".pdf"):
        pages = []
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                if text.strip():
                    pages.append((text, i))
        return pages
    elif filename.lower().endswith(".txt"):
        text = file_bytes.decode("utf-8", errors="ignore")
        return [(text, 1)]
    else:
        raise ValueError("Unsupported file type. Only .pdf and .txt are allowed.")

def chunk_text(pages: list[tuple[str, int]], source_file: str) -> list[ChunkDTO]:
    """Sliding-window chunking (~200-500 tokens, 10% overlap) with page tracking."""
    chunks = []
    chunk_index = 0

    for page_text, page_number in pages:
        words = page_text.split()
        if not words:
            continue

        start = 0
        while start < len(words):
            # take a word window that roughly maps to CHUNK_MAX_TOKENS
            approx_word_limit = int(CHUNK_MAX_TOKENS / 1.3)
            end = min(start + approx_word_limit, len(words))
            chunk_words = words[start:end]
            chunk_text_str = " ".join(chunk_words)
            token_count = _estimate_tokens(chunk_text_str)

            if token_count >= 20:  # skip tiny leftover fragments
                chunk_index += 1
                chunks.append(ChunkDTO(
                    chunk_id=f"{source_file.split('.')[0]}_chunk_{chunk_index:02d}",
                    source_file=source_file,
                    text=chunk_text_str,
                    token_count=token_count,
                    page_number=page_number
                ))

            overlap = int(len(chunk_words) * OVERLAP_RATIO)
            start = end - overlap if end - overlap > start else end

    return chunks