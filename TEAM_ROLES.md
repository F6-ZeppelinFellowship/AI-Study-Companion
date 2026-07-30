# 👥 Team Roles & Feature Ownership

This document details the feature breakdown, API contracts, UI ownership, and parallel workflow strategy for the **AI Study Companion**.

---

## 🔄 Integration Chain & Data Flow

```
[Member 1: PDF/Text Ingestion] 
       │ (Produces Chunks)
       ▼
[Member 2: Qdrant Indexing] 
       │ (Stores Embeddings + Metadata)
       ▼
[Member 3: Vector Search Engine] 
       │ (Retrieves Top-K Relevant Chunks)
       ▼
[Member 4: Structured LLM Generation] 
       │ (Outputs Structured Study Plan JSON)
       ▼
[Frontend Dashboard & Exporter]
```

---

## 🛠️ Individual Feature Breakdown

### 🟢 Member 1: Document Processing & Smart Chunking
* **Track:** AI Ingestion & Parsing
* **Git Branch:** `feature/member-1-chunking`
* **Core Responsibilities:**
  * Build PDF and plain text extraction pipelines using `pypdf` or `pdfplumber`.
  * Write a semantic/paragraph-aware chunking algorithm (~200–500 tokens with 10% overlap).
  * Expose API endpoint: `POST /api/v1/ingest/chunk`.
* **Frontend UI Ownership:**
  * File Dropzone component (PDF/TXT uploads).
  * Chunk Preview Drawer showing chunk cards, token counts, and page metadata.
* **Outputs to Team:** Array of `Chunk` objects containing `chunk_id`, `text`, `page_number`, and `token_count`.

---

### 🔵 Member 2: Vector Embeddings & Qdrant Engine
* **Track:** Vector DB & Infrastructure
* **Git Branch:** `feature/member-2-qdrant`
* **Core Responsibilities:**
  * Configure local Qdrant Vector DB container via `docker-compose.yml`.
  * Create Qdrant collection initialization logic using Cosine Similarity matching Gemini embedding dimensions.
  * Integrate Gemini `text-embedding-004` batch embedding service.
  * Expose API endpoint: `POST /api/v1/vector/upsert`.
* **Frontend UI Ownership:**
  * Qdrant Status & Collection Visualizer UI (indexed vector count, DB health status, vector payload inspector).
* **Outputs to Team:** Live Qdrant vector index ready for query filtering.

---

### 🟡 Member 3: Contextual RAG & Retrieval Engine
* **Track:** Search AI & Information Retrieval
* **Git Branch:** `feature/member-3-retrieval`
* **Core Responsibilities:**
  * Build query vector generator using Gemini embedding API.
  * Write Qdrant similarity search engine retrieving top-$k$ matching chunks based on cosine distance.
  * Implement score-threshold filtering to purge low-relevance context.
  * Expose API endpoint: `POST /api/v1/retrieval/search`.
* **Frontend UI Ownership:**
  * Interactive Semantic Search Bar.
  * Retrieved Context Inspector UI showing search query results, similarity score badges (e.g., `0.87`), and retrieved text blocks.
* **Outputs to Team:** Filtered list of top-$k$ relevant context strings for LLM prompting.

---

### 🟣 Member 4 (Lead): Structured LLM Engine & Study Plan Generator
* **Track:** LLM System Prompting & Generation
* **Git Branch:** `feature/member-4-study-plan`
* **Core Responsibilities:**
  * Design structured prompt templates combining target study goals with Member 3's retrieved context chunks.
  * Build Gemini generation pipeline enforcing strict JSON outputs (`response_mime_type="application/json"` and Pydantic validation).
  * Write fallback logic for edge cases where retrieved context lacks sufficient material.
  * Expose API endpoint: `POST /api/v1/generator/study-plan`.
* **Frontend UI Ownership:**
  * Study Plan Visual Dashboard (renders JSON into timelines, topic cards, and key terms).
  * Export Plan / Download JSON utility and loading state indicators.
* **Outputs to Team:** Final end-to-end RAG pipeline output ready for presentation.

---

## ⚡ How We Work in Parallel Without Blocking

1. **Contract-First Development:** Shared Pydantic models will be placed in `backend/app/models/` before writing core logic.
2. **Mock Data First:**
   * **Member 2** can mock Member 1's output by using hardcoded text chunks to test vector upserts.
   * **Member 3** can query pre-seeded Qdrant vectors while Member 1 finishes parsing.
   * **Member 4** can mock Member 3's search output with sample text strings to build and test LLM prompting immediately.
3. **Branching Strategy:**
   * Never commit directly to `main` or `dev`.
   * Push code to `feature/member-X-name` and open a Pull Request targeting `dev`.
   * PRs require at least 1 peer review approval before merging into `dev`.