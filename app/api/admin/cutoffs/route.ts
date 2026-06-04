import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { Category, SourceType, ConfidenceLevel } from "@prisma/client";

const cutoffSchema = z.object({
  programId: z.string().min(1, "Program ID is required"),
  year: z.number().int().positive(),
  round: z.number().int().positive(),
  category: z.nativeEnum(Category),
  openingRank: z.number().int().positive().nullable().optional(),
  closingRank: z.number().int().positive(),
  sourceTitle: z.string().min(1, "Source title is required"),
  sourceType: z.nativeEnum(SourceType),
  confidence: z.nativeEnum(ConfidenceLevel),
  sourceUrl: z.string().nullable().optional(),
  sourceNotes: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await req.json();
    const parsed = cutoffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Check program existence
    const programExists = await prisma.program.findUnique({
      where: { id: data.programId }
    });
    if (!programExists) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Check unique constraint [programId, year, round, category]
    const existing = await prisma.cutoff.findUnique({
      where: {
        programId_year_round_category: {
          programId: data.programId,
          year: data.year,
          round: data.round,
          category: data.category
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Cutoff record for this year, round, and category already exists for this program" }, { status: 409 });
    }

    // Create DataSource first
    const dataSource = await prisma.dataSource.create({
      data: {
        title: data.sourceTitle,
        url: data.sourceUrl || null,
        sourceType: data.sourceType,
        academicYear: String(data.year),
        confidence: data.confidence,
        notes: data.sourceNotes || null,
      }
    });

    // Create Cutoff and link to DataSource
    const cutoff = await prisma.cutoff.create({
      data: {
        programId: data.programId,
        sourceId: dataSource.id,
        year: data.year,
        round: data.round,
        category: data.category,
        openingRank: data.openingRank ?? null,
        closingRank: data.closingRank,
      },
      include: {
        source: true
      }
    });

    return NextResponse.json(cutoff, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
