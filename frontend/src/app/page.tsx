import PlanView from '../components/PlanView';

export default function Home() {
  const dummyPlan = {
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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10">
      <PlanView plan={dummyPlan} />
    </main>
  );
}