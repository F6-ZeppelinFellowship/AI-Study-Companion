# 📚 AI Study Companion (Part 1 — Ingestion & Retrieval Engine)

A Retrieval-Augmented Generation (RAG) platform built for the **AI & Generative AI Fellowship (Week 3 Project)**. 

The AI Study Companion allows users to upload course materials (syllabi, lecture notes, textbook excerpts), automatically chunks and converts the text into vector embeddings, stores them in **Qdran[...] 


---

## ⚡ Core Features

- **Document Ingestion:** Upload PDF or text files with automated text extraction.
- **Smart Chunking:** Splitting documents into 200–500 token segments with sliding window overlap.
- **Vector Storage:** Generating vector embeddings and storing payloads inside a **Qdrant** collection.
- **Contextual Retrieval:** Performing cosine similarity search to retrieve top-k relevant context chunks.
- **Structured Study Plan Generation:** LLM generation with strict JSON schema outputs grounded in retrieved context.
- **Interactive UI:** Next.js frontend with file dropzone, vector inspector, semantic search testbed, and study plan dashboard.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI (Python 3.11+), Uvicorn, Pydantic V2
- **Vector Database:** Qdrant (Docker / Local)
- **Document Parsing:** `PyPDF` / `pdfplumber`
- **Embeddings & LLM:** Google Gemini API (`text-embedding-004` + `gemini-2.5-flash`)

---

## 🏗️ Repository Architecture

```text
ai-study-companion/
├── docker-compose.yml       # Local Qdrant vector database container
├── .env.example             # Template for environment variables
├── README.md
│
├── backend/                 # FastAPI Application
│   ├── main.py              # Application entrypoint & CORS setup
│   ├── requirements.txt     # Backend dependencies
│   └── app/
│       ├── api/             # API routes (upload, vector, search, plan)
│       ├── core/            # App configurations & settings
│       ├── models/          # Pydantic schemas DTOs
│       └── services/        # Business logic (parsing, chunking, embeddings, Qdrant, LLM)
│
└── frontend/                # Next.js Application
    ├── package.json
    └── src/
            ├── app/             # Main dashboard views
            ├── components/      # UI components (UploadZone, SearchInspector, PlanView)
            └── lib/             # API client & TypeScript interfaces
```

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/F6-ZeppelinFellowship/ai-study-companion.git](https://github.com/F6-ZeppelinFellowship/ai-study-companion.git)
cd ai-study-companion
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in both the `backend/` directory and project root:

```bash
cp .env.example backend/.env
```

Fill in your API key and configuration:

```env
GEMINI_API_KEY=your_gemini_api_key_here
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_COLLECTION_NAME=study_materials
```

---

## 🐳 Qdrant Vector DB Setup Instructions

Qdrant is required to store vector embeddings and document metadata payloads.

### Option A: Running Qdrant via Docker Compose (Recommended)

Run the included `docker-compose.yml`:

```bash
docker-compose up -d
```

### Option B: Running Qdrant via Docker CLI directly

```bash
docker run -d -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
    qdrant/qdrant
```

### Verify Qdrant is Running

Open your browser and navigate to:
- **Qdrant Web UI Dashboard:** `http://localhost:6333/dashboard`
- **Cluster Health Status:** `http://localhost:6333/healthz`

---

## 🐍 Backend Setup (FastAPI)

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:
```cmd
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the FastAPI development server:

```bash
uvicorn main:app --reload --port 8000
```

5. View interactive API Documentation at `http://localhost:8000/docs`.

---

## 💻 Frontend Setup (Next.js)

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install npm packages:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Access the web app at `http://localhost:3000`.

---

## 📡 API Workflow Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/ingest/upload` | Upload PDF/Text document and receive chunked preview objects. |
| `POST` | `/api/v1/vector/index` | Generate embeddings and store vectors + payloads into Qdrant. |
| `POST` | `/api/v1/retrieval/search` | Perform cosine vector similarity search for relevant context. |
| `POST` | `/api/v1/generator/plan` | Run RAG pipeline to generate a structured JSON study plan. |

---

## ℹ️ Repository Info

- Repository: F6-ZeppelinFellowship/AI-Study-Companion
- Repo ID: 1316009802
- Description: A RAG-powered study companion that ingests syllabi/notes, indexes context in Qdrant, and generates structured JSON study plans.

### Latest relevant commit (provided):
- OID: b3a6496807cd9f2690258e349a80f6fe611bf0a5
- Message: Revise README for AI Study Companion project
- Author: ifra817 <ifraahmed817@gmail.com>
- Permalink: https://github.com/F6-ZeppelinFellowship/AI-Study-Companion/commit/b3a6496807cd9f2690258e349a80f6fe611bf0a5

## 🧭 Language Composition

- TypeScript: 68.3%
- Python: 31.3%
- Other: 0.4%
