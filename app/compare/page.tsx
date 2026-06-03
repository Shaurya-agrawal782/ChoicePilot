import type { Metadata } from "next";
import Link from "next/link";
import { Category, BranchCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  calculateMatch,
  type ProgrammeForScoring,
  type Priority,
} from "@/lib/recommendation-engine/calculate-match";

export const metadata: Metadata = {
  title: "Compare Counselling Routes — ChoicePilot",
  description: "Compare your strongest engineering counselling routes side-by-side.",
};

const BAND_CLASSES = {
  SAFE: {
    label: "SAFE",
    textClass: "text-safe",
    bgClass: "bg-safe/8",
    borderClass: "border-safe/20",
  },
  TARGET: {
    label: "TARGET",
    textClass: "text-target",
    bgClass: "bg-target/8",
    borderClass: "border-target/20",
  },
  DREAM: {
    label: "DREAM",
    textClass: "text-dream",
    bgClass: "bg-dream/8",
    borderClass: "border-dream/20",
  },
};

function formatFee(fee: number): string {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(2)}L`;
  if (fee >= 1000) return `₹${(fee / 1000).toFixed(0)}K`;
  return `₹${fee}`;
}

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="data-label text-[9px] font-mono text-muted uppercase tracking-wider w-16 shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-border/40 rounded-full h-1 overflow-hidden">
        <div
          className="bg-primary/50 h-1 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="data-label text-[9px] font-mono text-ink w-9 text-right shrink-0">
        {value}/{max}
      </span>
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{
    programs?: string;
    rank?: string;
    branches?: string;
    city?: string;
    maxFee?: string;
    priority?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  const {
    programs = "",
    rank = "",
    branches = "",
    city = "",
    maxFee = "",
    priority = "BALANCED",
  } = resolvedSearchParams;

  // Construct back URL to return with prefilled parameters
  let backUrl = "/predictor";
  if (rank) {
    backUrl = `/predictor?rank=${encodeURIComponent(rank)}`;
    const branchList = branches ? branches.split(",") : [];
    const firstBranch = branchList[0] || "";
    if (firstBranch) backUrl += `&branch=${encodeURIComponent(firstBranch)}`;
    if (city) backUrl += `&city=${encodeURIComponent(city)}`;
  }

  const programIds = programs.split(",").filter(Boolean);

  // If fewer than 2 routes supplied
  if (programIds.length < 2 || programIds.length > 3) {
    return (
      <main className="min-h-screen bg-paper text-ink pb-24">
        <div className="border-b border-border/60 bg-surface">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
            <Link
              href={backUrl}
              className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors tracking-wide flex items-center gap-1.5"
            >
              ← Back to Predictor
            </Link>
            <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
              ChoicePilot
            </span>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-6 pt-24 text-center">
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-3">
            ROUTE COMPARISON
          </span>
          <h1 className="display-heading text-3xl sm:text-4xl font-normal leading-tight text-ink mb-4">
            Compare your strongest options.
          </h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Comparison requires selecting between 2 and 3 counselling routes. Please go back to the predictor and select your preferences first.
          </p>
          <Link
            href={backUrl}
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-full transition-colors"
          >
            Back to Predictor
          </Link>
        </div>
      </main>
    );
  }

  // Query database for selected programs
  const fetchedPrograms = await prisma.program.findMany({
    where: {
      id: { in: programIds },
    },
    include: {
      college: true,
      cutoffs: {
        where: {
          category: Category.GENERAL,
          year: 2025,
          round: 1,
        },
        include: { source: true },
        take: 1,
      },
    },
  });

  const forScoring: ProgrammeForScoring[] = fetchedPrograms
    .filter((p) => p.cutoffs.length > 0)
    .map((p) => ({
      id: p.id,
      branchCode: p.branchCode,
      branchName: p.branchName,
      degree: p.degree,
      annualFee: p.annualFee,
      averagePackage: p.averagePackage,
      college: {
        id: p.college.id,
        name: p.college.name,
        slug: p.college.slug,
        city: p.college.city,
        state: p.college.state,
        type: p.college.type,
      },
      closingRank: p.cutoffs[0].closingRank,
      sourceConfidence: p.cutoffs[0].source?.confidence ?? null,
    }));

  // Double check that we still have >= 2 valid routes after verification
  if (forScoring.length < 2) {
    return (
      <main className="min-h-screen bg-paper text-ink pb-24">
        <div className="border-b border-border/60 bg-surface">
          <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
            <Link
              href={backUrl}
              className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors tracking-wide flex items-center gap-1.5"
            >
              ← Back to Predictor
            </Link>
            <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
              ChoicePilot
            </span>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-6 pt-24 text-center">
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-3">
            ROUTE COMPARISON
          </span>
          <h1 className="display-heading text-3xl sm:text-4xl font-normal leading-tight text-ink mb-4">
            Invalid routes.
          </h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            One or more of the selected routes could not be found or scored correctly. Please return to the predictor and choose again.
          </p>
          <Link
            href={backUrl}
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-full transition-colors"
          >
            Back to Predictor
          </Link>
        </div>
      </main>
    );
  }

  // Calculate scores
  const rankNum = parseInt(rank, 10);
  const preferredBranches = branches
    .split(",")
    .filter((b): b is BranchCode => Object.values(BranchCode).includes(b as BranchCode));
  const VALID_PRIORITIES = ["BALANCED", "PLACEMENTS", "LOW_FEES", "BRANCH_FIRST"];
  const priorityVal = VALID_PRIORITIES.includes(priority)
    ? (priority as Priority)
    : "BALANCED";

  const matchInput = {
    rank: isNaN(rankNum) || rankNum <= 0 ? 999999 : rankNum,
    preferredBranches,
    preferredCity: city || undefined,
    maxAnnualFee: maxFee ? parseInt(maxFee, 10) : undefined,
    priority: priorityVal,
  };

  const scoredResult = calculateMatch(forScoring, matchInput);
  const allScored = [
    ...scoredResult.safe,
    ...scoredResult.target,
    ...scoredResult.dream,
  ];

  // Map back to guarantee input order is preserved
  const compared = forScoring
    .map((fs) => allScored.find((r) => r.programmeId === fs.id))
    .filter(Boolean) as typeof allScored;

  // Highlights/Summary Calculations
  let highestScoreRoute = compared[0];
  for (const r of compared) {
    if (r.finalScore > highestScoreRoute.finalScore) {
      highestScoreRoute = r;
    }
  }

  let lowestTuitionRoute = null;
  for (const r of compared) {
    if (r.annualFee !== null) {
      if (!lowestTuitionRoute || r.annualFee < (lowestTuitionRoute.annualFee ?? 0)) {
        lowestTuitionRoute = r;
      }
    }
  }

  let highestPlacementRoute = null;
  for (const r of compared) {
    if (r.averagePackage !== null) {
      if (
        !highestPlacementRoute ||
        r.averagePackage > (highestPlacementRoute.averagePackage ?? 0)
      ) {
        highestPlacementRoute = r;
      }
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      {/* Header */}
      <div className="border-b border-border/60 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            href={backUrl}
            className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors tracking-wide flex items-center gap-1.5"
          >
            ← Back to Predictor
          </Link>
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
            ChoicePilot
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-10">
        <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-2">
          ROUTE COMPARISON
        </span>
        <h1 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink mb-3">
          Compare your strongest options.
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          Understand the trade-offs before placing a route in your counselling plan.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div
          className={`grid grid-cols-1 gap-6 ${
            compared.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {compared.map((rec) => {
            const band = BAND_CLASSES[rec.chanceBand];
            return (
              <div
                key={rec.programmeId}
                className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Badge */}
                  <div className="mb-4">
                    <span
                      className={`data-label text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded border uppercase ${band.textClass} ${band.bgClass} ${band.borderClass}`}
                    >
                      {band.label}
                    </span>
                  </div>

                  {/* College Name & details */}
                  <Link
                    href={`/colleges/${rec.college.slug}`}
                    className="text-lg font-semibold text-ink hover:text-primary transition-colors leading-tight block mb-1"
                  >
                    {rec.college.name}
                  </Link>
                  <p className="data-label text-xs font-mono text-muted mb-0.5">
                    {rec.programmeName} · {rec.degree}
                  </p>
                  <p className="data-label text-[10px] font-mono text-muted/70 mb-6">
                    {rec.college.city}, {rec.college.state}
                  </p>

                  {/* Key Metrics block */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50 mb-6">
                    <div>
                      <div className={`data-label text-xl font-mono font-bold ${band.textClass}`}>
                        {rec.finalScore}
                        <span className="text-muted text-xs font-normal">/100</span>
                      </div>
                      <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                        Match Score
                      </div>
                    </div>

                    <div>
                      <div className="data-label text-sm font-mono font-semibold text-ink">
                        {rec.closingRank.toLocaleString()}
                      </div>
                      <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                        Closing Rank
                      </div>
                    </div>

                    <div>
                      <div className="data-label text-sm font-mono font-semibold text-ink">
                        {rec.annualFee !== null ? formatFee(rec.annualFee) : "—"}
                      </div>
                      <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                        Annual Fee
                      </div>
                    </div>

                    <div>
                      <div className="data-label text-sm font-mono font-semibold text-ink">
                        {rec.annualFee !== null ? formatFee(rec.annualFee * 4) : "—"}
                      </div>
                      <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                        Est. 4-Yr Tuition
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="data-label text-sm font-mono font-semibold text-safe">
                        {rec.averagePackage !== null ? `₹${rec.averagePackage.toFixed(1)}L` : "—"}
                      </div>
                      <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                        Average Package
                      </div>
                    </div>
                  </div>

                  {/* Breakdown breakdown */}
                  <div>
                    <span className="data-label text-[9px] font-mono font-semibold uppercase tracking-widest text-muted block mb-3">
                      Score Breakdown
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <ScoreBar label="Cutoff" value={rec.scoreBreakdown.cutoffFit} max={35} />
                      <ScoreBar label="Branch" value={rec.scoreBreakdown.branchFit} max={25} />
                      <ScoreBar label="Budget" value={rec.scoreBreakdown.budgetFit} max={15} />
                      <ScoreBar label="Location" value={rec.scoreBreakdown.locationFit} max={10} />
                      <ScoreBar label="Placement" value={rec.scoreBreakdown.placementFit} max={10} />
                      <ScoreBar label="Source" value={rec.scoreBreakdown.sourceTrust} max={5} />
                      {rec.scoreBreakdown.priorityBonus > 0 && (
                        <ScoreBar label="Priority" value={rec.scoreBreakdown.priorityBonus} max={5} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary/Highlights Panel */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-6">
            HIGHLIGHTS SUMMARY
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highest Score */}
            <div>
              <span className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1">
                Highest Match Score
              </span>
              <p className="text-base font-semibold text-ink leading-tight">
                {highestScoreRoute.college.name}
              </p>
              <p className="data-label text-[11px] font-mono text-primary mt-1">
                {highestScoreRoute.programmeName} · Match Score: {highestScoreRoute.finalScore}
              </p>
            </div>

            {/* Lowest Fee */}
            <div>
              <span className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1">
                Lowest Four-Year Tuition
              </span>
              {lowestTuitionRoute ? (
                <>
                  <p className="text-base font-semibold text-ink leading-tight">
                    {lowestTuitionRoute.college.name}
                  </p>
                  <p className="data-label text-[11px] font-mono text-safe mt-1">
                    {lowestTuitionRoute.programmeName} · Est: {formatFee((lowestTuitionRoute.annualFee ?? 0) * 4)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">Tuition details unavailable.</p>
              )}
            </div>

            {/* Placement */}
            <div>
              <span className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1">
                Strongest Placement Indicator
              </span>
              {highestPlacementRoute ? (
                <>
                  <p className="text-base font-semibold text-ink leading-tight">
                    {highestPlacementRoute.college.name}
                  </p>
                  <p className="data-label text-[11px] font-mono text-safe mt-1">
                    {highestPlacementRoute.programmeName} · Avg: ₹{(highestPlacementRoute.averagePackage ?? 0).toFixed(1)}L
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">Placement details unavailable.</p>
              )}
            </div>
          </div>

          <div className="border-t border-border/50 pt-5 mt-6">
            <p className="data-label text-[10px] font-mono text-muted/70 leading-relaxed">
              Based on available demo data and your selected preferences. Historical performance does not guarantee future results. ChoicePilot does not claim any route is objectively superior.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
