import type { Metadata } from "next";
import CollegeExplorerClient from "@/components/colleges/CollegeExplorerClient";

export const metadata: Metadata = {
  title: "College Explorer — ChoicePilot",
  description:
    "Search and filter engineering colleges across Madhya Pradesh by city, branch, type and fee.",
};

export default function CollegesPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10 md:pt-20 md:pb-12">
        <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-muted font-mono uppercase">
          COLLEGE EXPLORER
        </span>
        <h1 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink mt-3">
          Explore engineering routes.
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed mt-3 max-w-xl">
          Search and filter demo college options across Madhya Pradesh.
        </p>
      </div>

      {/* Explorer Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <CollegeExplorerClient />
      </div>
    </main>
  );
}
