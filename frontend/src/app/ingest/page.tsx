"use client";

import { useState } from "react";
import UploadZone, { IngestUploadResponse } from "../../components/UploadZone";
import ChunkPreviewDrawer from "../../components/ChunkPreviewDrawer";

export default function IngestPage() {
  const [result, setResult] = useState<IngestUploadResponse | null>(null);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
      <h1 className="text-xl font-semibold text-center mb-8 text-zinc-800 dark:text-zinc-200">
        Document Ingestion & Chunking
      </h1>
      <UploadZone onChunksReceived={setResult} />
      <ChunkPreviewDrawer data={result} />
    </main>
  );
}