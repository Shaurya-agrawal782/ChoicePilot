import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
        <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <span className="data-label text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded border uppercase text-warning bg-warning/5 border-warning/20">
            Access Denied
          </span>
          <h1 className="display-heading text-2xl font-normal leading-tight text-ink mt-6 mb-3">
            Admin privilege required.
          </h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Your account does not have administrator permissions. If you believe this is an error, please contact support.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-full transition-colors w-full"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const collegeCount = await prisma.college.count();
  const programCount = await prisma.program.count();
  const cutoffCount = await prisma.cutoff.count();

  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      {/* Header */}
      <div className="border-b border-border/60 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
            ChoicePilot Admin
          </span>
          <div className="flex items-center gap-6">
            <span className="data-label text-xs font-mono text-muted">
              {session.user.name ?? session.user.email} (ADMIN)
            </span>
            <Link
              href="/dashboard"
              className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors uppercase tracking-wider"
            >
              Exit Console
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-8">
        <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-2">
          ADMIN DATA CONSOLE
        </span>
        <h1 className="display-heading text-3xl sm:text-4xl font-normal leading-tight text-ink">
          Manage counselling data.
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed mt-2 max-w-xl">
          Maintain colleges, programmes, cutoff records and source confidence used by ChoicePilot.
        </p>
      </div>

      {/* Grid of summaries */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="data-label text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
              Colleges
            </div>
            <div className="text-2xl font-mono font-semibold text-ink">
              {collegeCount}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="data-label text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
              Programmes
            </div>
            <div className="text-2xl font-mono font-semibold text-ink">
              {programCount}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="data-label text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
              Cutoff Records
            </div>
            <div className="text-2xl font-mono font-semibold text-ink">
              {cutoffCount}
            </div>
          </div>
        </div>

        {/* Note info block */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-8">
          <p className="text-sm text-muted leading-relaxed">
            <span className="font-semibold text-ink">Note:</span> Management controls will be added in the next step.
          </p>
        </div>

        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full border border-border hover:bg-border/10 text-ink transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
