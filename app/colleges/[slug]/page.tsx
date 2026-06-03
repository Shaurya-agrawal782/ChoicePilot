import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const DATA_NOTICE =
  "Development demo data — verify official sources before counselling.";

// ── Types ────────────────────────────────────────────────────────────────────

interface DataSource {
  id: string;
  title: string;
  url: string | null;
  sourceType: string;
  academicYear: string | null;
  confidence: string;
}

interface Cutoff {
  id: string;
  year: number;
  round: number;
  category: string;
  openingRank: number | null;
  closingRank: number;
  counsellingAuthority: string;
  source: DataSource | null;
}

interface Program {
  id: string;
  branchCode: string;
  branchName: string;
  degree: string;
  durationYears: number;
  annualFee: number | null;
  examAccepted: string;
  averagePackage: number | null;
  highestPackage: number | null;
  placementYear: string | null;
  cutoffs: Cutoff[];
}

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  affiliation: string | null;
  approvalStatus: string | null;
  officialWebsite: string | null;
  overview: string | null;
  hostelAvailable: boolean | null;
  programs: Program[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  GOVERNMENT: "Government",
  PRIVATE: "Private",
  AUTONOMOUS: "Autonomous",
};

const TYPE_COLORS: Record<string, string> = {
  GOVERNMENT: "text-safe bg-safe/8 border-safe/20",
  PRIVATE: "text-dream bg-dream/8 border-dream/20",
  AUTONOMOUS: "text-target bg-target/8 border-target/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL: "General",
  OBC: "OBC",
  SC: "SC",
  ST: "ST",
  EWS: "EWS",
};

const EXAM_LABELS: Record<string, string> = {
  JEE_MAIN: "JEE Main",
  MP_DTE: "MP DTE",
};

function formatFee(fee: number): string {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(2)}L`;
  if (fee >= 1000) return `₹${(fee / 1000).toFixed(0)}K`;
  return `₹${fee}`;
}

function formatPackage(pkg: number): string {
  return `₹${pkg.toFixed(1)}L`;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getCollege(slug: string): Promise<College | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/colleges/${slug}`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch college");

    const json = await res.json();
    return json.college as College;
  } catch {
    return null;
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollege(slug);

  if (!college) {
    return { title: "College Not Found — ChoicePilot" };
  }

  return {
    title: `${college.name} — ChoicePilot`,
    description: `Explore programmes, fees, cutoffs, and placement data for ${college.name} in ${college.city}, Madhya Pradesh.`,
  };
}

// ── Confidence badge ──────────────────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: string }) {
  if (level === "DEMO") {
    return (
      <span className="data-label text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border uppercase text-target bg-target/8 border-target/20">
        Demo Data
      </span>
    );
  }
  if (level === "VERIFIED") {
    return (
      <span className="data-label text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border uppercase text-safe bg-safe/8 border-safe/20">
        Verified
      </span>
    );
  }
  return (
    <span className="data-label text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border uppercase text-muted bg-border/30 border-border">
      Partial
    </span>
  );
}

// ── Cutoff table for a program ────────────────────────────────────────────────

function CutoffTable({ cutoffs }: { cutoffs: Cutoff[] }) {
  if (cutoffs.length === 0) {
    return (
      <p className="data-label text-[10px] font-mono text-muted/60 italic mt-2">
        No cutoff data available for this programme.
      </p>
    );
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50">
            <th className="data-label text-[9px] font-mono font-semibold uppercase tracking-wider text-muted pb-2 pr-4">
              Year
            </th>
            <th className="data-label text-[9px] font-mono font-semibold uppercase tracking-wider text-muted pb-2 pr-4">
              Round
            </th>
            <th className="data-label text-[9px] font-mono font-semibold uppercase tracking-wider text-muted pb-2 pr-4">
              Category
            </th>
            <th className="data-label text-[9px] font-mono font-semibold uppercase tracking-wider text-muted pb-2 pr-4">
              Closing Rank
            </th>
            <th className="data-label text-[9px] font-mono font-semibold uppercase tracking-wider text-muted pb-2">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {cutoffs.map((cutoff) => (
            <tr
              key={cutoff.id}
              className="border-b border-border/30 last:border-0"
            >
              <td className="data-label text-xs font-mono text-ink py-2 pr-4">
                {cutoff.year}
              </td>
              <td className="data-label text-xs font-mono text-muted py-2 pr-4">
                R{cutoff.round}
              </td>
              <td className="data-label text-xs font-mono text-ink py-2 pr-4">
                {CATEGORY_LABELS[cutoff.category] ?? cutoff.category}
              </td>
              <td className="data-label text-sm font-mono font-semibold text-ink py-2 pr-4">
                {cutoff.closingRank.toLocaleString("en-IN")}
              </td>
              <td className="py-2">
                <ConfidenceBadge
                  level={cutoff.source?.confidence ?? "DEMO"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Programme card ────────────────────────────────────────────────────────────

function ProgramCard({
  program,
  collegeCity,
}: {
  program: Program;
  collegeCity: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Programme header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-ink tracking-tight">
            {program.branchName}
          </h3>
          <p className="data-label text-xs font-mono text-muted mt-0.5">
            {program.degree} · {program.durationYears} Years ·{" "}
            {EXAM_LABELS[program.examAccepted] ?? program.examAccepted}
          </p>
        </div>

        {/* Key metrics */}
        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-4 sm:gap-1.5 shrink-0">
          {program.annualFee !== null && (
            <div className="text-left sm:text-right">
              <div className="data-label text-base font-mono font-semibold text-ink">
                {formatFee(program.annualFee)}
                <span className="text-muted text-xs font-normal"> /yr</span>
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Annual Fee
              </div>
            </div>
          )}
          {program.averagePackage !== null && (
            <div className="text-left sm:text-right">
              <div className="data-label text-sm font-mono font-semibold text-safe">
                {formatPackage(program.averagePackage)}
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Avg Package
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Placement row */}
      {(program.highestPackage !== null || program.placementYear) && (
        <div className="flex flex-wrap gap-6 py-3 border-b border-border/40">
          {program.highestPackage !== null && (
            <div>
              <div className="data-label text-xs font-mono font-semibold text-ink">
                {formatPackage(program.highestPackage)}
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Highest Package
              </div>
            </div>
          )}
          {program.placementYear && (
            <div>
              <div className="data-label text-xs font-mono text-muted">
                {program.placementYear}
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Placement Year
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cutoffs */}
      <div className="pt-4">
        <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-1">
          Historical Cutoffs
        </span>
        <CutoffTable cutoffs={program.cutoffs} />
      </div>

      {/* Check My Fit — links to predictor pre-filled with branch + city */}
      <div className="mt-5 pt-4 border-t border-border/40">
        <Link
          href={`/predictor?branch=${program.branchCode}&city=${encodeURIComponent(collegeCity)}`}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          Check My Fit →
        </Link>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await getCollege(slug);

  if (!college) {
    notFound();
  }

  const typeColor =
    TYPE_COLORS[college.type] ?? "text-muted bg-border/30 border-border";
  const typeLabel = TYPE_LABELS[college.type] ?? college.type;

  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* ── Top navigation row ── */}
      <div className="border-b border-border/60 bg-surface sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            href="/colleges"
            className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors tracking-wide flex items-center gap-1.5"
          >
            ← Back to Explorer
          </Link>
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
            ChoicePilot
          </span>
        </div>
      </div>

      {/* ── Hero section ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-10 md:pt-16 md:pb-12">
        {/* Demo notice */}
        <div className="inline-flex items-center gap-2 bg-border/30 border border-border rounded-lg px-3 py-1.5 mb-6">
          <span className="data-label text-[10px] sm:text-xs font-mono text-muted tracking-wide">
            ⚠ {DATA_NOTICE}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`data-label text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border uppercase ${typeColor}`}
          >
            {typeLabel}
          </span>
        </div>

        <h1 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink">
          {college.name}
        </h1>

        <p className="data-label text-sm font-mono text-muted mt-2">
          {college.city} · {college.state}
        </p>

        {college.affiliation && (
          <p className="text-sm text-muted mt-1">{college.affiliation}</p>
        )}

        {college.overview && (
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-4 max-w-2xl">
            {college.overview}
          </p>
        )}

        {/* Meta chips */}
        <div className="flex flex-wrap gap-3 mt-6">
          {college.hostelAvailable !== null && (
            <span className="data-label text-[10px] font-mono text-muted bg-surface border border-border px-3 py-1 rounded-full">
              {college.hostelAvailable ? "Hostel Available" : "No Hostel"}
            </span>
          )}
          {college.approvalStatus && (
            <span className="data-label text-[10px] font-mono text-muted bg-surface border border-border px-3 py-1 rounded-full">
              {college.approvalStatus}
            </span>
          )}
          {college.officialWebsite && (
            <a
              href={college.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="data-label text-[10px] font-mono font-semibold text-primary bg-surface border border-primary/30 px-3 py-1 rounded-full hover:bg-primary/5 transition-colors"
            >
              Official Website ↗
            </a>
          )}
        </div>
      </div>

      {/* ── Programmes ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="border-t border-border/60 pt-10">
          <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-muted font-mono uppercase block mb-6">
            Programmes · {college.programs.length} available
          </span>

          {college.programs.length === 0 ? (
            <p className="text-sm text-muted">
              No programme data available for this college.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {college.programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  collegeCity={college.city}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Responsible disclaimer ── */}
        <div className="mt-16 border-t border-border/40 pt-8">
          <p className="data-label text-[10px] sm:text-xs font-mono text-muted/70 leading-relaxed max-w-2xl">
            Historical/demo figures are shown for product testing. Verify
            official current-year counselling information before making
            decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
