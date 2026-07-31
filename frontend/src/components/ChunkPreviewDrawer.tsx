"use client";

import { IngestUploadResponse } from "./UploadZone";

interface ChunkPreviewDrawerProps {
  data: IngestUploadResponse | null;
}

export default function ChunkPreviewDrawer({ data }: ChunkPreviewDrawerProps) {
  if (!data) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {data.source_file}
        </h3>
        <span className="text-xs text-zinc-400">{data.total_chunks} chunks</span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {data.chunks.map((chunk) => (
          <div
            key={chunk.chunk_id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-zinc-400">{chunk.chunk_id}</span>
              <div className="flex gap-2 text-xs text-zinc-400">
                <span>Page {chunk.page_number}</span>
                <span>•</span>
                <span>{chunk.token_count} tokens</span>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
              {chunk.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}