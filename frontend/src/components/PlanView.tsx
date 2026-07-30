'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Layers,
} from 'lucide-react';

export interface DailyTask {
  day: number;
  topic: string;
  tasks: string[];
  est_study_time: number;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface StudyPlanResponse {
  title: string;
  summary: string;
  daily_schedule: DailyTask[];
  key_terms: KeyTerm[];
  is_context_sufficient: boolean;
  fallback_message?: string | null;
}

interface PlanViewProps {
  plan: StudyPlanResponse;
}

export default function PlanView({ plan }: PlanViewProps) {
  // Track completed tasks using key format: "dayIndex-taskIndex"
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  // Track open/collapsed days (all open by default)
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() =>
    plan.daily_schedule.reduce((acc, d) => ({ ...acc, [d.day]: true }), {})
  );

  // Calculate overall task stats
  const totalTasks = plan.daily_schedule.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const toggleTask = (day: number, taskIdx: number) => {
    const key = `${day}-${taskIdx}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDayAccordion = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const exportAsMarkdown = () => {
    let md = `# ${plan.title}\n\n${plan.summary}\n\n`;
    md += `## Daily Schedule\n\n`;
    plan.daily_schedule.forEach((d) => {
      md += `### Day ${d.day}: ${d.topic} (${d.est_study_time} mins)\n`;
      d.tasks.forEach((t) => {
        md += `- [ ] ${t}\n`;
      });
      md += `\n`;
    });
    md += `## Key Terms\n\n`;
    plan.key_terms.forEach((k) => {
      md += `- **${k.term}**: ${k.definition}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* 1. Context Warning Banner */}
      {!plan.is_context_sufficient && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Limited Course Context</p>
            <p className="mt-1">
              {plan.fallback_message ||
                'The retrieved materials lacked full detail for this goal. Showing a generalized AI outline.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Header & Action Card */}
      <header className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3 h-3" /> AI Study Plan
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {plan.daily_schedule.length} Days Duration
              </span>
            </div>
            {/* VIBRANT GRADIENT TITLE */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
              {plan.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAsMarkdown}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Export Markdown
            </button>
          </div>
        </div>

        {/* BRIGHT WHITE SUMMARY */}
        <p className="text-zinc-600 dark:text-zinc-100 text-sm md:text-base leading-relaxed">
          {plan.summary}
        </p>

        {/* Global Progress Bar */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-1.5">
            <span>Overall Progress</span>
            {/* LIGHT GREY PROGRESS DESCRIPTION */}
            <span className="text-zinc-400">
              {completedCount} of {totalTasks} tasks completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Daily Timeline (65%) */}
        <main className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Daily Breakdown
          </h2>

          <div className="space-y-4">
            {plan.daily_schedule.map((dayItem) => {
              const isExpanded = expandedDays[dayItem.day] ?? true;
              const dayTaskKeys = dayItem.tasks.map((_, idx) => `${dayItem.day}-${idx}`);
              const dayCompletedCount = dayTaskKeys.filter((k) => completedTasks[k]).length;

              return (
                <div
                  key={dayItem.day}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden transition-all"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleDayAccordion(dayItem.day)}
                    className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-left hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        Day {dayItem.day}
                      </div>
                      <div className="min-w-0">
                        {/* BRIGHT WHITE SUB-TOPICS */}
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-base">
                          {dayItem.topic}
                        </h3>
                        {/* LIGHT GREY ACCORDION DESCRIPTION */}
                        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {dayItem.est_study_time} mins
                          </span>
                          <span>•</span>
                          <span>
                            {dayCompletedCount}/{dayItem.tasks.length} Done
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-zinc-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 md:px-5 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/30 space-y-2.5">
                      {dayItem.tasks.map((task, idx) => {
                        const key = `${dayItem.day}-${idx}`;
                        const isDone = !!completedTasks[key];

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleTask(dayItem.day, idx)}
                            className={`group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              isDone
                                /* MUTED GREEN LINE-THROUGH */
                                ? 'bg-zinc-100/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-emerald-400/80 line-through'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-indigo-300 dark:hover:border-indigo-800'
                            }`}
                          >
                            <button className="mt-0.5 shrink-0 focus:outline-none">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />
                              )}
                            </button>
                            <span className="text-sm leading-snug">{task}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT COLUMN: Key Terms Sidebar (35%) */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Key Vocabulary
          </h2>

          <div className="space-y-3">
            {plan.key_terms.map((termItem, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-1.5"
              >
                {/* BRIGHT WHITE KEY TERMS */}
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {termItem.term}
                </h4>
                {/* LIGHT GREY KEY DEFINITIONS */}
                <p className="text-xs text-zinc-600 dark:text-zinc-200 leading-relaxed">
                  {termItem.definition}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}