import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BranchCode, Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  calculateMatch,
  type ProgrammeForScoring,
  type MatchInput,
  type Priority,
} from "@/lib/recommendation-engine/calculate-match";

// ── Validation schema ─────────────────────────────────────────────────────────

const requestSchema = z.object({
  rank: z.number().int().positive(),
  preferredBranches: z
    .array(z.nativeEnum(BranchCode))
    .min(1, "At least one branch preference is required.")
    .max(3, "A maximum of 3 branch preferences are allowed.")
    .refine(
      (branches) => new Set(branches).size === branches.length,
      { message: "Preferred branches must not contain duplicates." }
    ),
  preferredCity: z.string().optional(),
  maxAnnualFee: z.number().int().positive().optional(),
  priority: z.enum(["BALANCED", "PLACEMENTS", "LOW_FEES", "BRANCH_FIRST"]),
});

const DATA_NOTICE =
  "Demo historical guidance only — verify official current-year counselling data before making decisions.";

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Parse JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Validate
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const { rank, preferredBranches, preferredCity, maxAnnualFee, priority } =
    parsed.data;

  try {
    // Fetch programmes that:
    //   - match at least one preferred branch
    //   - have a GENERAL / 2025 / Round-1 cutoff record
    const programmes = await prisma.program.findMany({
      where: {
        branchCode: { in: preferredBranches },
        cutoffs: {
          some: {
            category: Category.GENERAL,
            year: 2025,
            round: 1,
          },
        },
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

    // Transform to scoring shape
    const forScoring: ProgrammeForScoring[] = programmes
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

    const matchInput: MatchInput = {
      rank,
      preferredBranches,
      preferredCity,
      maxAnnualFee,
      priority: priority as Priority,
    };

    const result = calculateMatch(forScoring, matchInput);
    const total =
      result.dream.length + result.target.length + result.safe.length;

    return NextResponse.json({
      recommendations: result,
      counts: {
        dream: result.dream.length,
        target: result.target.length,
        safe: result.safe.length,
        total,
      },
      notice: DATA_NOTICE,
    });
  } catch (error) {
    console.error("Predictor API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
