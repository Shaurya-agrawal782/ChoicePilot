import type { Metadata } from "next";
import Link from "next/link";
import PredictorClient from "@/components/predictor/PredictorClient";

export const metadata: Metadata = {
  title: "Smart Match Predictor — ChoicePilot",
  description:
    "Get explainable Dream, Target and Safe programme options based on your JEE Main rank, branch preferences, budget and priorities.",
};

export default async function PredictorPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; city?: string }>;
}) {
  const { branch, city } = await searchParams;

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* ── Top nav ── */}
      <div className="border-b border-border/60 bg-surface sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors tracking-wide flex items-center gap-1.5"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted hover:text-ink uppercase transition-colors"
            >
              Dashboard
            </Link>
            <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
              ChoicePilot
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-10 md:pt-16 md:pb-12">
        <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-primary font-mono uppercase bg-primary/10 py-1 px-3 rounded-full">
          Smart Match Engine
        </span>
        <h1 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink mt-4">
          Build your counselling route.
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed mt-3 max-w-xl">
          Get explainable Dream, Target and Safe options based on your rank and
          preferences.
        </p>
      </div>

      {/* ── Form + Results ── */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-24">
        <PredictorClient initialBranch={branch} initialCity={city} />
      </div>
    </main>
  );
}
