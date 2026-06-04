import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { BranchCode, ExamType } from "@prisma/client";

const programSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
  branchCode: z.nativeEnum(BranchCode),
  branchName: z.string().min(1, "Branch name is required"),
  degree: z.string().default("B.Tech"),
  durationYears: z.number().int().positive().default(4),
  annualFee: z.number().int().positive().nullable().optional(),
  examAccepted: z.nativeEnum(ExamType),
  averagePackage: z.number().positive().nullable().optional(),
  highestPackage: z.number().positive().nullable().optional(),
  placementYear: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await req.json();
    const parsed = programSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Check college existence
    const collegeExists = await prisma.college.findUnique({
      where: { id: data.collegeId }
    });
    if (!collegeExists) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Check uniqueness constraint: [collegeId, branchCode, examAccepted]
    const existing = await prisma.program.findUnique({
      where: {
        collegeId_branchCode_examAccepted: {
          collegeId: data.collegeId,
          branchCode: data.branchCode,
          examAccepted: data.examAccepted
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Program with this branch and exam type already exists for this college" }, { status: 409 });
    }

    const program = await prisma.program.create({
      data: {
        collegeId: data.collegeId,
        branchCode: data.branchCode,
        branchName: data.branchName,
        degree: data.degree,
        durationYears: data.durationYears,
        annualFee: data.annualFee ?? null,
        examAccepted: data.examAccepted,
        averagePackage: data.averagePackage ?? null,
        highestPackage: data.highestPackage ?? null,
        placementYear: data.placementYear || null,
      }
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
