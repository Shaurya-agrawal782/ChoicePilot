import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Methodology — ChoicePilot",
  description:
    "How ChoicePilot separates eligibility signals, preference fit and data-confidence labels.",
};

const confidenceLabels = [
  {
    label: "Demo",
    description: "development/testing record",
    className: "border-target/20 bg-target/8 text-target",
  },
  {
    label: "Partially Verified",
    description: "data reviewed but not fully confirmed",
    className: "border-dream/20 bg-dream/8 text-dream",
  },
  {
    label: "Verified",
    description: "intended for records confirmed from official sources",
    className: "border-safe/20 bg-safe/8 text-safe",
  },
];

export default function AboutDataPage() {
  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      <header className="border-b border-border/60 bg-surface">
        <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors tracking-wide"
          >
            ← Back to Home
          </Link>
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
            ChoicePilot
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 md:pt-20">
        <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-muted font-mono uppercase">
          DATA METHODOLOGY
        </span>
        <h1 className="display-heading text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-ink mt-3 max-w-3xl">
          Transparent guidance, not hidden guesses.
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed mt-5 max-w-2xl">
          ChoicePilot separates historical eligibility signals from personal preference fit so students can understand why a route appears.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-12 md:mt-16 space-y-12">
        <section className="border-t border-border pt-8">
          <h2 className="display-heading text-2xl sm:text-3xl font-normal text-ink">
            Current Dataset
          </h2>
          <div className="mt-4 space-y-3 text-sm sm:text-base text-muted leading-relaxed">
            <p>Current deployed dataset is development/demo data for product evaluation.</p>
            <p>It includes sample MP engineering colleges, programmes, fees, placement indicators and cutoff records.</p>
            <p>Demo-labelled records are visible in the interface.</p>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="display-heading text-2xl sm:text-3xl font-normal text-ink">
            How Recommendations Work
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-safe/20 bg-safe/8 rounded-xl p-4">
              <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-safe uppercase">
                Safe
              </span>
              <p className="text-sm text-muted leading-relaxed mt-2">
                Rank comfortably within the historical closing-rank range.
              </p>
            </div>
            <div className="border border-target/20 bg-target/8 rounded-xl p-4">
              <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-target uppercase">
                Target
              </span>
              <p className="text-sm text-muted leading-relaxed mt-2">
                Rank close to the historical closing rank.
              </p>
            </div>
            <div className="border border-dream/20 bg-dream/8 rounded-xl p-4">
              <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-dream uppercase">
                Dream
              </span>
              <p className="text-sm text-muted leading-relaxed mt-2">
                Rank slightly beyond the historical closing rank.
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-5">
            Match score combines cutoff fit, branch preference, budget, location, placement indicator and source trust.
          </p>
          <p className="mt-5 border-l-2 border-primary/40 pl-4 text-sm font-medium text-ink leading-relaxed">
            ChoicePilot uses deterministic explainable scoring, not AI-generated admission guarantees.
          </p>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="display-heading text-2xl sm:text-3xl font-normal text-ink">
            Source Confidence Labels
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {confidenceLabels.map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border border-border rounded-xl bg-surface p-4"
              >
                <span className={`data-label w-fit rounded-full border px-3 py-1 text-[10px] font-mono font-semibold tracking-widest uppercase ${item.className}`}>
                  {item.label}
                </span>
                <span className="text-sm text-muted leading-relaxed">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="display-heading text-2xl sm:text-3xl font-normal text-ink">
            Planned Official Sources
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-4">
            Production dataset expansion would use:
          </p>
          <ul className="mt-4 space-y-2 text-sm sm:text-base text-muted leading-relaxed list-disc pl-5">
            <li>DTE MP / official counselling cutoff records</li>
            <li>Official college fee and programme information</li>
            <li>Regulatory or official placement disclosures where available</li>
          </ul>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="display-heading text-2xl sm:text-3xl font-normal text-ink">
            Responsible Use
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-4">
            Students should verify official current-year counselling information before making final admission decisions.
          </p>
        </section>
      </div>
    </main>
  );
}
