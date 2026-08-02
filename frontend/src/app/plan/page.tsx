'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanView, { StudyPlanResponse } from '../../components/PlanView';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<StudyPlanResponse | null>(null);

  useEffect(() => {
    // Retrieve stored plan from sessionStorage
    const savedPlan = sessionStorage.getItem('studyPlan');
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error("Failed to parse stored study plan", e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      {/* Top Navigation Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Upload New Document
        </button>

        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Companion
        </span>
      </div>

      {/* Render PlanView or Skeleton State */}
      {plan ? (
        <PlanView plan={plan} />
      ) : (
        <div className="max-w-md mx-auto text-center py-20 space-y-4">
          <p className="text-zinc-400 text-sm">No study plan found.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium"
          >
            Go to Upload Page
          </button>
        </div>
      )}
    </main>
  );
}