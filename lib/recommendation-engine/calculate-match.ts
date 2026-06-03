import type { BranchCode, ConfidenceLevel } from "@prisma/client";

// ── Public types ──────────────────────────────────────────────────────────────

export type Priority = "BALANCED" | "PLACEMENTS" | "LOW_FEES" | "BRANCH_FIRST";
export type ChanceBand = "SAFE" | "TARGET" | "DREAM";

export interface ProgrammeForScoring {
  id: string;
  branchCode: BranchCode;
  branchName: string;
  degree: string;
  annualFee: number | null;
  averagePackage: number | null;
  college: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    type: string;
  };
  /** Closing rank from the GENERAL / 2025 / Round 1 cutoff record */
  closingRank: number;
  sourceConfidence: ConfidenceLevel | null;
}

export interface MatchInput {
  rank: number;
  preferredBranches: BranchCode[];
  preferredCity?: string;
  maxAnnualFee?: number;
  priority: Priority;
}

export interface ScoreBreakdown {
  cutoffFit: number;
  branchFit: number;
  budgetFit: number;
  locationFit: number;
  placementFit: number;
  sourceTrust: number;
  priorityBonus: number;
}

export interface Recommendation {
  programmeId: string;
  programmeName: string;
  degree: string;
  branchCode: string;
  college: {
    id: string;
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

export interface MatchResult {
  dream: Recommendation[];
  target: Recommendation[];
  safe: Recommendation[];
}

// ── Chance band ───────────────────────────────────────────────────────────────

/**
 * Returns SAFE / TARGET / DREAM based purely on closing rank thresholds.
 * Returns null when the programme should be excluded (rank too high).
 *
 * SAFE   : rank ≤ 85 % of closingRank
 * TARGET : rank > 85 % and ≤ closingRank
 * DREAM  : rank > closingRank and ≤ 125 % of closingRank
 * Exclude: rank > 125 % of closingRank
 */
function getChanceBand(rank: number, closingRank: number): ChanceBand | null {
  const safeThreshold = Math.floor(closingRank * 0.85);
  const dreamLimit = Math.ceil(closingRank * 1.25);

  if (rank > dreamLimit) return null;
  if (rank > closingRank) return "DREAM";
  if (rank > safeThreshold) return "TARGET";
  return "SAFE";
}

// ── Score helpers ─────────────────────────────────────────────────────────────

function cutoffScore(band: ChanceBand): number {
  return band === "SAFE" ? 35 : band === "TARGET" ? 28 : 18;
}

function branchScore(index: number): number {
  return index === 0 ? 25 : index === 1 ? 20 : 15;
}

function placementScore(avg: number | null): number {
  if (avg === null) return 0;
  if (avg >= 6) return 10;
  if (avg >= 4) return 7;
  return 4;
}

function sourceTrustScore(confidence: ConfidenceLevel | null): number {
  if (confidence === "VERIFIED") return 5;
  if (confidence === "PARTIALLY_VERIFIED") return 3;
  return 1; // DEMO or null
}

function priorityBonus(
  priority: Priority,
  prog: ProgrammeForScoring,
  branchIndex: number
): number {
  if (priority === "PLACEMENTS" && prog.averagePackage !== null && prog.averagePackage >= 6) {
    return 5;
  }
  if (priority === "LOW_FEES" && prog.annualFee !== null && prog.annualFee <= 75000) {
    return 5;
  }
  if (priority === "BRANCH_FIRST" && branchIndex === 0) {
    return 5;
  }
  return 0;
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Score each programme deterministically and return recommendations
 * grouped by chance band, sorted by score desc then fee asc.
 *
 * Only programmes that have a GENERAL / 2025 / Round-1 cutoff record are
 * expected as input (the API enforces this filter at the DB query level).
 */
export function calculateMatch(
  programmes: ProgrammeForScoring[],
  input: MatchInput
): MatchResult {
  const { rank, preferredBranches, preferredCity, maxAnnualFee, priority } = input;
  const recommendations: Recommendation[] = [];

  for (const prog of programmes) {
    // ── Branch fit ──────────────────────────────────────────────────────────
    const branchIndex = preferredBranches.indexOf(prog.branchCode);
    if (branchIndex === -1) continue; // not in the student's preferences

    // ── Chance band ─────────────────────────────────────────────────────────
    const band = getChanceBand(rank, prog.closingRank);
    if (band === null) continue; // rank too far above closing rank

    const warnings: string[] = [];
    const reasons: string[] = [];

    // ── Cutoff Fit (max 35) ─────────────────────────────────────────────────
    const cutoffFit = cutoffScore(band);
    if (band === "SAFE") {
      reasons.push(
        `Strong cutoff fit — your rank is well within the closing rank of ${prog.closingRank.toLocaleString("en-IN")}`
      );
    } else if (band === "TARGET") {
      reasons.push(
        `On-target rank match — closing rank ${prog.closingRank.toLocaleString("en-IN")}`
      );
    } else {
      reasons.push(
        `Reach-level match — closing rank ${prog.closingRank.toLocaleString("en-IN")}`
      );
    }

    // ── Branch Fit (max 25) ─────────────────────────────────────────────────
    const branchFit = branchScore(branchIndex);
    const prefLabel = branchIndex === 0 ? "Top" : branchIndex === 1 ? "2nd" : "3rd";
    reasons.push(`${prefLabel} branch preference: ${prog.branchName}`);

    // ── Budget Fit (max 15) — may exclude programme ──────────────────────────
    let budgetFit: number;
    const hasMaxFee =
      maxAnnualFee !== undefined && maxAnnualFee !== null && maxAnnualFee > 0;

    if (!hasMaxFee || prog.annualFee === null) {
      budgetFit = 10; // no constraint or fee unknown
    } else if (prog.annualFee <= maxAnnualFee) {
      budgetFit = 15;
      reasons.push(
        `Annual fee ₹${(prog.annualFee / 100000).toFixed(2)}L is within your budget`
      );
    } else if (prog.annualFee <= maxAnnualFee * 1.1) {
      budgetFit = 6;
      warnings.push(
        `Annual fee ₹${(prog.annualFee / 100000).toFixed(2)}L slightly exceeds your budget of ₹${(maxAnnualFee / 100000).toFixed(2)}L`
      );
    } else {
      continue; // more than 10% above budget — exclude
    }

    // ── Location Fit (max 10) ───────────────────────────────────────────────
    let locationFit: number;
    if (!preferredCity || preferredCity.trim() === "") {
      locationFit = 7;
    } else if (
      prog.college.city.toLowerCase() === preferredCity.toLowerCase()
    ) {
      locationFit = 10;
      reasons.push(`Located in your preferred city: ${prog.college.city}`);
    } else {
      locationFit = 4;
    }

    // ── Placement Fit (max 10) ──────────────────────────────────────────────
    const placementFit = placementScore(prog.averagePackage);
    if (prog.averagePackage !== null) {
      if (prog.averagePackage >= 6) {
        reasons.push(
          `Strong placements — avg package ₹${prog.averagePackage.toFixed(1)}L`
        );
      } else if (prog.averagePackage >= 4) {
        reasons.push(`Average package ₹${prog.averagePackage.toFixed(1)}L`);
      }
    }

    // ── Source Trust (max 5) ────────────────────────────────────────────────
    const sourceTrust = sourceTrustScore(prog.sourceConfidence);

    // ── Priority bonus ──────────────────────────────────────────────────────
    const bonus = priorityBonus(priority, prog, branchIndex);

    // ── Final score (clamped to 100) ────────────────────────────────────────
    const rawScore =
      cutoffFit + branchFit + budgetFit + locationFit + placementFit + sourceTrust + bonus;
    const finalScore = Math.min(100, rawScore);

    recommendations.push({
      programmeId: prog.id,
      programmeName: prog.branchName,
      degree: prog.degree,
      branchCode: prog.branchCode,
      college: prog.college,
      chanceBand: band,
      finalScore,
      scoreBreakdown: {
        cutoffFit,
        branchFit,
        budgetFit,
        locationFit,
        placementFit,
        sourceTrust,
        priorityBonus: bonus,
      },
      annualFee: prog.annualFee,
      averagePackage: prog.averagePackage,
      closingRank: prog.closingRank,
      reasons,
      warnings,
    });
  }

  // Sort: score desc, then fee asc (nulls last)
  recommendations.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    const fA = a.annualFee ?? Infinity;
    const fB = b.annualFee ?? Infinity;
    return fA - fB;
  });

  return {
    dream: recommendations.filter((r) => r.chanceBand === "DREAM"),
    target: recommendations.filter((r) => r.chanceBand === "TARGET"),
    safe: recommendations.filter((r) => r.chanceBand === "SAFE"),
  };
}
