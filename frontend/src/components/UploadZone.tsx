"use client";

import { useState, useRef } from "react";

export interface ChunkDTO {
  chunk_id: string;
  source_file: string;
  text: string;
  token_count: number;
  page_number: number;
}

export interface IngestUploadResponse {
  source_file: string;
  total_chunks: number;
  chunks: ChunkDTO[];
}

interface UploadZoneProps {
  onChunksReceived: (data: IngestUploadResponse) => void;
}

export default function UploadZone({ onChunksReceived }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".txt")) {
      setError("Only .pdf and .txt files are supported.");
      return;
    }

    setError(null);
    setIsUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ingest/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Upload failed.");
      }

      const data: IngestUploadResponse = await res.json();
      onChunksReceived(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-zinc-300 dark:border-zinc-700"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileSelect}
        />

        {isUploading ? (
          <p className="text-sm text-zinc-500">Processing {fileName}...</p>
        ) : (
          <>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Drag & drop a PDF or TXT file here, or click to browse
            </p>
            <p className="text-xs text-zinc-400 mt-1">Course syllabi, lecture notes, textbook excerpts</p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}