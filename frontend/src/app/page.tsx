'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone, { IngestUploadResponse } from '../components/UploadZone';
import ChunkPreviewDrawer from '../components/ChunkPreviewDrawer';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [ingestData, setIngestData] = useState<IngestUploadResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleChunksReceived = (data: IngestUploadResponse) => {
    setIngestData(data);
  };

  const handleGeneratePlan = async () => {
    if (!ingestData) return;
    setIsGenerating(true);

    try {
      // 1. Send chunk data to backend generator (Member 3 integration point)
      const res = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunks: ingestData.chunks }),
      });

      let planData;
      if (res.ok) {
        planData = await res.json();
      } else {
        // Fallback to mock plan if API isn't live yet
        planData = getMockPlan();
      }

      // 2. Save generated plan to sessionStorage so /plan can read it
      sessionStorage.setItem('studyPlan', JSON.stringify(planData));

      // 3. Navigate to the /plan route
      router.push('/plan');
    } catch (err) {
      console.warn("Backend API not reachable. Using local plan data.", err);
      sessionStorage.setItem('studyPlan', JSON.stringify(getMockPlan()));
      router.push('/plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto mb-10 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" /> AI-Powered Learning
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          AI Study Companion
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Upload your lecture notes, course syllabi, or textbook excerpts to build a custom structured study plan.
        </p>
      </header>

      {/* Upload Zone & Chunk Drawer */}
      <div className="max-w-3xl mx-auto space-y-8">
        <UploadZone onChunksReceived={handleChunksReceived} />

        {ingestData && (
          <div className="space-y-6">
            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="w-full max-w-md mx-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <span>Generating Study Plan with AI...</span>
              ) : (
                <>
                  <span>Generate Study Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <ChunkPreviewDrawer data={ingestData} />
          </div>
        )}
      </div>
    </main>
  );
}

// Fallback plan structure
function getMockPlan() {
  return {
    title: "3-Day Study Plan: Qdrant HNSW Vector Indexing",
    summary: "Over three days, you will learn Qdrant HNSW graph indexing, vector distance metrics, and payload metadata filtering.",
    daily_schedule: [
      {
        day: 1,
        topic: "HNSW Graph Concepts",
        tasks: [
          "Read chunk_001 to understand what HNSW is.",
          "Compare Cosine Similarity, Dot Product, and Euclidean Distance."
        ],
        est_study_time: 90
      },
      {
        day: 2,
        topic: "Distance Metrics",
        tasks: [
          "Perform manual distance calculations.",
          "Test vector queries in Qdrant."
        ],
        est_study_time: 60
      }
    ],
    key_terms: [
      {
        term: "HNSW",
        definition: "Hierarchical Navigable Small World vector index structure."
      },
      {
        term: "Payload",
        definition: "Metadata attached to vector embeddings in Qdrant."
      }
    ],
    is_context_sufficient: true,
    fallback_message: null
  };
}