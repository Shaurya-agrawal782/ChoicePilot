import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function formatFee(fee: number): string {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(2)}L`;
  if (fee >= 1000) return `₹${(fee / 1000).toFixed(0)}K`;
  return `₹${fee}`;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const savedRoutes = await prisma.savedRoute.findMany({
    where: { userId: session.user.id },
    include: {
      program: {
        include: {
          college: true,
          cutoffs: {
            where: {
              category: "GENERAL",
              year: 2025,
              round: 1,
            },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      {/* Header */}
      <div className="border-b border-border/60 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase">
            ChoicePilot
          </span>
          <div className="flex items-center gap-6">
            <span className="data-label text-xs font-mono text-muted">
              {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="data-label text-xs font-mono font-semibold text-muted hover:text-ink transition-colors uppercase tracking-wider"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="data-label text-[10px] font-mono font-semibold tracking-widest text-muted uppercase block mb-2">
            USER DASHBOARD
          </span>
          <h1 className="display-heading text-3xl sm:text-4xl font-normal leading-tight text-ink">
            Your saved routes.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/colleges"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink bg-surface border border-border hover:bg-border/10 rounded-full transition-colors"
          >
            Explore Colleges
          </Link>
          <Link
            href="/predictor"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-surface bg-primary hover:bg-primary/95 rounded-full transition-colors"
          >
            Generate Predictor Route
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {savedRoutes.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto mt-8">
            <p className="text-sm text-muted mb-6 leading-relaxed">
              No routes saved yet. Explore colleges or generate a route to start your shortlist.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/colleges"
                className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                Explore Colleges
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/predictor"
                className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                Predictor
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRoutes.map((saved) => {
              const { program } = saved;
              const closingRank = program.cutoffs[0]?.closingRank;
              return (
                <div
                  key={saved.id}
                  className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="data-label text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border uppercase text-muted bg-border/20 border-border">
                      SAVED
                    </span>

                    <h2 className="text-base font-semibold text-ink hover:text-primary transition-colors leading-tight mt-4 mb-1">
                      <Link href={`/colleges/${program.college.slug}`}>
                        {program.college.name}
                      </Link>
                    </h2>
                    <p className="data-label text-xs font-mono text-muted">
                      {program.branchName} · {program.degree}
                    </p>
                    <p className="data-label text-[10px] font-mono text-muted/70 mt-0.5 mb-6">
                      {program.college.city}, {program.college.state}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50 mb-6">
                      <div>
                        <div className="data-label text-sm font-mono font-semibold text-ink">
                          {closingRank ? closingRank.toLocaleString() : "—"}
                        </div>
                        <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                          Closing Rank
                        </div>
                      </div>

                      <div>
                        <div className="data-label text-sm font-mono font-semibold text-ink">
                          {program.annualFee ? formatFee(program.annualFee) : "—"}
                        </div>
                        <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                          Annual Fee
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="data-label text-sm font-mono font-semibold text-safe">
                          {program.averagePackage
                            ? `₹${program.averagePackage.toFixed(1)}L`
                            : "—"}
                        </div>
                        <div className="data-label text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">
                          Average Package
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <form
                      action={async () => {
                        "use server";
                        await prisma.savedRoute.deleteMany({
                          where: {
                            id: saved.id,
                            userId: session.user.id,
                          },
                        });
                        revalidatePath("/dashboard");
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border border-warning/30 text-warning hover:bg-warning/5 transition-colors w-full justify-center"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
