import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { Category, SourceType, ConfidenceLevel } from "@prisma/client";

const cutoffUpdateSchema = z.object({
  year: z.number().int().positive().optional(),
  round: z.number().int().positive().optional(),
  category: z.nativeEnum(Category).optional(),
  openingRank: z.number().int().positive().nullable().optional(),
  closingRank: z.number().int().positive().optional(),
  sourceTitle: z.string().min(1, "Source title is required").optional(),
  sourceType: z.nativeEnum(SourceType).optional(),
  confidence: z.nativeEnum(ConfidenceLevel).optional(),
  sourceUrl: z.string().nullable().optional(),
  sourceNotes: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await verifyAdmin();
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = cutoffUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Verify cutoff exists
    const cutoffExists = await prisma.cutoff.findUnique({
      where: { id },
      include: { source: true }
    });
    if (!cutoffExists) {
      return NextResponse.json({ error: "Cutoff record not found" }, { status: 404 });
    }

    // Verify unique constraint if year, round, or category changes
    const programId = cutoffExists.programId;
    const nextYear = data.year ?? cutoffExists.year;
    const nextRound = data.round ?? cutoffExists.round;
    const nextCategory = data.category ?? cutoffExists.category;

    if (
      (data.year && data.year !== cutoffExists.year) ||
      (data.round && data.round !== cutoffExists.round) ||
      (data.category && data.category !== cutoffExists.category)
    ) {
      const duplicate = await prisma.cutoff.findUnique({
        where: {
          programId_year_round_category: {
            programId,
            year: nextYear,
            round: nextRound,
            category: nextCategory,
          }
        }
      });
      if (duplicate) {
        return NextResponse.json({ error: "Cutoff record for this year, round, and category already exists for this program" }, { status: 409 });
      }
    }

    // Update DataSource if present and source fields are updated
    if (cutoffExists.sourceId) {
      const dsUpdate: Record<string, unknown> = {};
      if (data.sourceTitle !== undefined) dsUpdate.title = data.sourceTitle;
      if (data.sourceUrl !== undefined) dsUpdate.url = data.sourceUrl || null;
      if (data.sourceType !== undefined) dsUpdate.sourceType = data.sourceType;
      if (data.year !== undefined) dsUpdate.academicYear = String(data.year);
      if (data.confidence !== undefined) dsUpdate.confidence = data.confidence;
      if (data.sourceNotes !== undefined) dsUpdate.notes = data.sourceNotes || null;

      if (Object.keys(dsUpdate).length > 0) {
        await prisma.dataSource.update({
          where: { id: cutoffExists.sourceId },
          data: dsUpdate,
        });
      }
    }

    // Update Cutoff
    const updatedCutoff = await prisma.cutoff.update({
      where: { id },
      data: {
        year: data.year,
        round: data.round,
        category: data.category,
        openingRank: data.openingRank !== undefined ? data.openingRank : undefined,
        closingRank: data.closingRank,
      },
      include: {
        source: true,
      }
    });

    return NextResponse.json(updatedCutoff);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
