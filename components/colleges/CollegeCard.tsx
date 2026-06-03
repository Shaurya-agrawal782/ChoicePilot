import Link from "next/link";

interface Program {
  id: string;
  branchCode: string;
  branchName: string;
  annualFee: number | null;
  averagePackage: number | null;
}

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  type: string;
  programs: Program[];
}

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

function formatFee(fee: number) {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(2)}L`;
  if (fee >= 1000) return `₹${(fee / 1000).toFixed(0)}K`;
  return `₹${fee}`;
}

export default function CollegeCard({ college }: { college: College }) {
  const typeColor = TYPE_COLORS[college.type] ?? "text-muted bg-border/30 border-border";
  const typeLabel = TYPE_LABELS[college.type] ?? college.type;

  const minFee = college.programs
    .map((p) => p.annualFee)
    .filter((f): f is number => f !== null)
    .sort((a, b) => a - b)[0];

  const avgPackages = college.programs
    .map((p) => p.averagePackage)
    .filter((p): p is number => p !== null);
  const maxAvgPackage = avgPackages.length > 0 ? Math.max(...avgPackages) : null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        {/* Left: College Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`data-label text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border uppercase ${typeColor}`}
            >
              {typeLabel}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-ink tracking-tight mt-1">
            {college.name}
          </h3>
          <p className="data-label text-xs font-mono text-muted mt-0.5">
            {college.city} · Madhya Pradesh
          </p>

          {/* Programs */}
          {college.programs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {college.programs.map((p) => (
                <span
                  key={p.id}
                  className="data-label text-[10px] font-mono text-ink bg-paper border border-border/70 px-2 py-0.5 rounded-full"
                >
                  {p.branchCode}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Key Metrics */}
        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-4 sm:gap-2 shrink-0">
          {minFee !== undefined && (
            <div className="text-left sm:text-right">
              <div className="data-label text-base font-mono font-semibold text-ink">
                {formatFee(minFee)}
                <span className="text-muted text-xs font-normal"> /yr</span>
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                {college.programs.length > 1 ? "From" : ""} Annual Fee
              </div>
            </div>
          )}

          {maxAvgPackage !== null && (
            <div className="text-left sm:text-right">
              <div className="data-label text-sm font-mono font-semibold text-safe">
                ₹{maxAvgPackage}L
              </div>
              <div className="data-label text-[9px] font-mono text-muted uppercase tracking-wider">
                Avg Package
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <span className="data-label text-[10px] font-mono text-muted/60">
          {college.programs.length} programme{college.programs.length !== 1 ? "s" : ""} available
        </span>
        <Link
          href={`/colleges/${college.slug}`}
          className="data-label text-[10px] font-mono font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/5 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
