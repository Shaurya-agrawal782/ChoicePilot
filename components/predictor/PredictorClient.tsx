"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type Priority = "BALANCED" | "PLACEMENTS" | "LOW_FEES" | "BRANCH_FIRST";
type ChanceBand = "SAFE" | "TARGET" | "DREAM";

interface ScoreBreakdown {
  cutoffFit: number;
  branchFit: number;
  budgetFit: number;
  locationFit: number;
  placementFit: number;
  sourceTrust: number;
  priorityBonus: number;
}

interface Recommendation {
  programmeId: string;
  programmeName: string;
  degree: string;
  branchCode: string;
  college: {
    name: string;
    slug: string;
    city: string;
    state: string;
    type: string;
  };
  chanceBand: ChanceBand;
  finalScore: number;
  scoreBreakdown: ScoreBreakdown;
  annualFee: number | null;
  averagePackage: number | null;
  closingRank: number;
  reasons: string[];
  warnings: string[];
}

interface PredictorResult {
  recommendations: {
    dream: Recommendation[];
    target: Recommendation[];
    safe: Recommendation[];
  };
  counts: { dream: number; target: number; safe: number; total: number };
  notice: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BRANCH_OPTIONS = [
  { value: "CSE", label: "Computer Science Engineering" },
  { value: "AIML", label: "AI & Machine Learning" },
  { value: "IT", label: "Information Technology" },
  { value: "EC", label: "Electronics & Communication" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
];

const CITY_OPTIONS = [
  { value: "", label: "Any City" },
  { value: "Bhopal", label: "Bhopal" },
  { value: "Indore", label: "Indore" },
  { value: "Gwalior", label: "Gwalior" },
  { value: "Jabalpur", label: "Jabalpur" },
];

const PRIORITY_OPTIONS = [
  { value: "BALANCED", label: "Balanced" },
  { value: "PLACEMENTS", label: "Placements" },
  { value: "LOW_FEES", label: "Low Fees" },
  { value: "BRANCH_FIRST", label: "Branch First" },
];

const BAND_CONFIG: Record<
  ChanceBand,
  { label: string; textClass: string; bgClass: string; borderClass: string }
> = {
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

const BAND_DESCRIPTIONS: Record<ChanceBand, string> = {
  SAFE: "Your rank is well within the closing rank — high admission likelihood.",
  TARGET: "Your rank is near the closing rank — realistic with a good overall application.",
  DREAM: "Your rank is above the closing rank — these are reach programmes.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFee(fee: number): string {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(2)}L`;
  if (fee >= 1000) return `₹${(fee / 1000).toFixed(0)}K`;
  return `₹${fee}`;
}

/** Returns branch options for a select, excluding branches chosen in `others`. */
function branchesFor(current: string, others: string[]) {
  return BRANCH_OPTIONS.filter(
    (b) => b.value === current || !others.includes(b.value)
  );
}

// ── Score bar ─────────────────────────────────────────────────────────────────

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

// ── Recommendation card ───────────────────────────────────────────────────────

function RecommendationCard({
  rec,
  isSelected,
  onToggle,
}: {
  rec: Recommendation;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const band = BAND_CONFIG[rec.chanceBand];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`data-label text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border uppercase ${band.textClass} ${band.bgClass} ${band.borderClass}`}
            >
              {band.label}
            </span>
          </div>
          <Link
            href={`/colleges/${rec.college.slug}`}
            className="text-base font-semibold text-ink hover:text-primary transition-colors leading-tight"
          >
            {rec.college.name}
          </Link>
          <p className="data-label text-xs font-mono text-muted mt-0.5">
            {rec.programmeName} · {rec.degree}
          </p>
          <p className="data-label text-[10px] font-mono text-muted/70 mt-0.5">
            {rec.college.city}, {rec.college.state}
          </p>
        </div>

        {/* Metrics column */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-5 sm:gap-2 shrink-0">
          {/* Score */}
          <div className="text-left sm:text-right">
            <div
              className={`data-label text-2xl font-mono font-bold leading-none ${band.textClass}`}
            >
              {rec.finalScore}
              <span className="text-muted text-sm font-normal">/100</span>
            </div>
            <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider mt-0.5">
              Match Score
            </div>
          </div>

          {rec.annualFee !== null && (
            <div className="text-left sm:text-right">
              <div className="data-label text-sm font-mono font-semibold text-ink">
                {formatFee(rec.annualFee)}
                <span className="text-muted text-xs font-normal"> /yr</span>
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Annual Fee
              </div>
            </div>
          )}

          {rec.averagePackage !== null && (
            <div className="text-left sm:text-right">
              <div className="data-label text-sm font-mono font-semibold text-safe">
                ₹{rec.averagePackage.toFixed(1)}L
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Avg Package
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score breakdown */}
      <div className="py-4 border-b border-border/40">
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

      {/* Reasons */}
      {rec.reasons.length > 0 && (
        <div className="py-3 border-b border-border/40">
          <ul className="flex flex-col gap-1">
            {rec.reasons.map((reason, i) => (
              <li
                key={i}
                className="data-label text-[10px] font-mono text-muted flex items-start gap-1.5"
              >
                <span className="text-safe shrink-0 mt-px">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {rec.warnings.length > 0 && (
        <div className="py-3 border-b border-border/40">
          <ul className="flex flex-col gap-1">
            {rec.warnings.map((warning, i) => (
              <li
                key={i}
                className="data-label text-[10px] font-mono text-warning flex items-start gap-1.5"
              >
                <span className="shrink-0 mt-px">⚠</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add to Compare / Remove toggle */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
            isSelected
              ? "bg-warning/10 border-warning text-warning hover:bg-warning/20"
              : "bg-surface border-border text-ink hover:bg-border/10"
          }`}
        >
          {isSelected ? "Remove" : "Add to Compare"}
        </button>
      </div>
    </div>
  );
}

// ── Band section ──────────────────────────────────────────────────────────────

function BandSection({
  band,
  recommendations,
  selectedRoutes,
  onToggleSelect,
}: {
  band: ChanceBand;
  recommendations: Recommendation[];
  selectedRoutes: Recommendation[];
  onToggleSelect: (rec: Recommendation) => void;
}) {
  if (recommendations.length === 0) return null;
  const cfg = BAND_CONFIG[band];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`data-label text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-full border uppercase ${cfg.textClass} ${cfg.bgClass} ${cfg.borderClass}`}
        >
          {cfg.label}
        </span>
        <span className="data-label text-[10px] font-mono text-muted">
          {recommendations.length}{" "}
          {recommendations.length === 1 ? "option" : "options"} ·{" "}
          {BAND_DESCRIPTIONS[band]}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.programmeId}
            rec={rec}
            isSelected={selectedRoutes.some((r) => r.programmeId === rec.programmeId)}
            onToggle={() => onToggleSelect(rec)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface PredictorClientProps {
  initialBranch?: string;
  initialCity?: string;
}

const VALID_BRANCHES = BRANCH_OPTIONS.map((b) => b.value);
const VALID_CITIES = CITY_OPTIONS.map((c) => c.value);

export default function PredictorClient({
  initialBranch,
  initialCity,
}: PredictorClientProps) {
  // Form state
  const [rank, setRank] = useState("");
  const [pref1, setPref1] = useState(
    initialBranch && VALID_BRANCHES.includes(initialBranch) ? initialBranch : ""
  );
  const [pref2, setPref2] = useState("");
  const [pref3, setPref3] = useState("");
  const [city, setCity] = useState(
    initialCity && VALID_CITIES.includes(initialCity) ? initialCity : ""
  );
  const [maxFee, setMaxFee] = useState("");
  const [priority, setPriority] = useState<Priority>("BALANCED");

  // Request state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictorResult | null>(null);

  // Compare state
  const [selectedRoutes, setSelectedRoutes] = useState<Recommendation[]>([]);
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);

  const toggleSelect = (rec: Recommendation) => {
    setSelectedRoutes((prev) => {
      const exists = prev.some((r) => r.programmeId === rec.programmeId);
      if (exists) {
        setSelectionWarning(null);
        return prev.filter((r) => r.programmeId !== rec.programmeId);
      } else {
        if (prev.length >= 3) {
          setSelectionWarning("Maximum 3 routes can be compared at once.");
          return prev;
        }
        setSelectionWarning(null);
        return [...prev, rec];
      }
    });
  };

  // Shared Tailwind classes
  const inputCls =
    "w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors";
  const labelCls =
    "data-label text-[10px] font-mono font-semibold uppercase tracking-wider text-muted block mb-1.5";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSelectedRoutes([]);
    setSelectionWarning(null);

    const rankNum = parseInt(rank, 10);
    if (!rank || isNaN(rankNum) || rankNum <= 0) {
      setError("Please enter a valid positive rank.");
      return;
    }
    if (!pref1) {
      setError("Please select at least one branch preference.");
      return;
    }

    const preferredBranches = [pref1, pref2, pref3].filter(Boolean);
    const body: Record<string, unknown> = {
      rank: rankNum,
      preferredBranches,
      priority,
    };
    if (city) body.preferredCity = city;
    if (maxFee) {
      const fee = parseInt(maxFee, 10);
      if (!isNaN(fee) && fee > 0) body.maxAnnualFee = fee;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const errData = data as { error?: string };
        setError(errData.error ?? "Something went wrong. Please try again.");
      } else {
        setResult(data as PredictorResult);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Rank */}
            <div className="sm:col-span-2">
              <label htmlFor="pred-rank" className={labelCls}>
                JEE Main Rank *
              </label>
              <input
                id="pred-rank"
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 45000"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            {/* Branch preferences */}
            <div className="sm:col-span-2">
              <span className={labelCls}>Branch Preferences</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Pref 1 */}
                <div>
                  <label
                    htmlFor="pred-pref1"
                    className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1"
                  >
                    Preference 1 *
                  </label>
                  <select
                    id="pred-pref1"
                    value={pref1}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPref1(v);
                      if (v && v === pref2) setPref2("");
                      if (v && v === pref3) setPref3("");
                    }}
                    className={inputCls}
                    required
                  >
                    <option value="">— Select —</option>
                    {branchesFor(pref1, [pref2, pref3]).map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pref 2 */}
                <div>
                  <label
                    htmlFor="pred-pref2"
                    className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1"
                  >
                    Preference 2
                  </label>
                  <select
                    id="pred-pref2"
                    value={pref2}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPref2(v);
                      if (v && v === pref3) setPref3("");
                    }}
                    className={inputCls}
                  >
                    <option value="">— None —</option>
                    {branchesFor(pref2, [pref1, pref3]).map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pref 3 */}
                <div>
                  <label
                    htmlFor="pred-pref3"
                    className="data-label text-[9px] font-mono text-muted uppercase tracking-wider block mb-1"
                  >
                    Preference 3
                  </label>
                  <select
                    id="pred-pref3"
                    value={pref3}
                    onChange={(e) => setPref3(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">— None —</option>
                    {branchesFor(pref3, [pref1, pref2]).map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="pred-city" className={labelCls}>
                Preferred City
              </label>
              <select
                id="pred-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max annual fee */}
            <div>
              <label htmlFor="pred-fee" className={labelCls}>
                Max Annual Fee (₹) — Optional
              </label>
              <input
                id="pred-fee"
                type="number"
                min={1}
                step={1000}
                placeholder="e.g. 150000"
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Priority */}
            <div className="sm:col-span-2">
              <label htmlFor="pred-priority" className={labelCls}>
                Priority
              </label>
              <select
                id="pred-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={inputCls}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 pt-5 border-t border-border/50">
            <button
              id="pred-submit"
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/90 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating…" : "Generate My Route"}
            </button>
          </div>
        </div>
      </form>

      {/* ── Error state ── */}
      {error && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl px-5 py-4 mb-6">
          <p className="data-label text-xs font-mono text-warning">{error}</p>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="bg-surface border border-border rounded-xl px-5 py-10 text-center mb-6">
          <p className="data-label text-xs font-mono text-muted">
            Calculating your counselling route…
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {result && !loading && (
        <div className="pb-24">
          {/* Notice banner */}
          <div className="flex items-start gap-2.5 bg-border/30 border border-border rounded-lg px-4 py-3 mb-6">
            <span className="text-muted shrink-0 mt-px">⚠</span>
            <p className="data-label text-[10px] sm:text-xs font-mono text-muted leading-relaxed">
              {result.notice}
            </p>
          </div>

          {/* Counts */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(
              [
                { key: "safe" as const, band: "SAFE" as ChanceBand },
                { key: "target" as const, band: "TARGET" as ChanceBand },
                { key: "dream" as const, band: "DREAM" as ChanceBand },
              ] as const
            ).map(({ key, band }) => {
              const cfg = BAND_CONFIG[band];
              return (
                <div
                  key={key}
                  className={`bg-surface border rounded-xl px-4 py-3 text-center ${cfg.borderClass}`}
                >
                  <div
                    className={`data-label text-2xl font-mono font-bold ${cfg.textClass}`}
                  >
                    {result.counts[key]}
                  </div>
                  <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider mt-0.5">
                    {cfg.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No-match state */}
          {result.counts.total === 0 && (
            <div className="bg-surface border border-border rounded-xl px-6 py-10 text-center">
              <p className="text-sm font-medium text-ink mb-2">
                No matching programmes found.
              </p>
              <p className="data-label text-xs font-mono text-muted max-w-sm mx-auto leading-relaxed">
                Try increasing your budget, selecting additional branch
                preferences, or choosing &ldquo;Any City&rdquo; for a broader
                search.
              </p>
            </div>
          )}

          {/* Band sections — Safe first, then Target, then Dream */}
          {result.counts.total > 0 && (
            <>
              {selectionWarning && (
                <div className="bg-warning/5 border border-warning/20 rounded-xl px-5 py-3 mb-6">
                  <p className="data-label text-xs font-mono text-warning">
                    {selectionWarning}
                  </p>
                </div>
              )}

              <BandSection
                band="SAFE"
                recommendations={result.recommendations.safe}
                selectedRoutes={selectedRoutes}
                onToggleSelect={toggleSelect}
              />
              <BandSection
                band="TARGET"
                recommendations={result.recommendations.target}
                selectedRoutes={selectedRoutes}
                onToggleSelect={toggleSelect}
              />
              <BandSection
                band="DREAM"
                recommendations={result.recommendations.dream}
                selectedRoutes={selectedRoutes}
                onToggleSelect={toggleSelect}
              />
            </>
          )}

          {/* Disclaimer */}
          {result.counts.total > 0 && (
            <div className="border-t border-border/40 pt-6 mt-2">
              <p className="data-label text-[10px] font-mono text-muted/70 leading-relaxed max-w-2xl">
                Historical/demo figures are shown for product testing. Verify
                official current-year counselling information before making
                decisions. ChoicePilot does not guarantee admission outcomes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Compare bottom tray ── */}
      {selectedRoutes.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.05)] px-4 py-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-sm font-semibold text-ink">
                {selectedRoutes.length} routes selected
              </span>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                {selectedRoutes.map((r) => (
                  <span
                    key={r.programmeId}
                    className="data-label text-[10px] px-2.5 py-0.5 bg-paper rounded-full border border-border text-muted"
                  >
                    {r.college.name.length > 20
                      ? r.college.name.substring(0, 17) + "..."
                      : r.college.name}{" "}
                    ({r.branchCode})
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedRoutes([]);
                  setSelectionWarning(null);
                }}
                className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink transition-colors"
              >
                Clear
              </button>
              <Link
                href={`/compare?programs=${encodeURIComponent(
                  selectedRoutes.map((r) => r.programmeId).join(",")
                )}&rank=${encodeURIComponent(rank)}&branches=${encodeURIComponent(
                  [pref1, pref2, pref3].filter(Boolean).join(",")
                )}&city=${encodeURIComponent(city)}&priority=${encodeURIComponent(
                  priority
                )}${maxFee ? `&maxFee=${encodeURIComponent(maxFee)}` : ""}`}
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-full transition-colors"
              >
                Compare Selected Routes
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
