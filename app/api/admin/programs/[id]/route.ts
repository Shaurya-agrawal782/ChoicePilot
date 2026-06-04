import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { BranchCode, ExamType } from "@prisma/client";

const programUpdateSchema = z.object({
  branchCode: z.nativeEnum(BranchCode).optional(),
  branchName: z.string().min(1, "Branch name is required").optional(),
  degree: z.string().optional(),
  durationYears: z.number().int().positive().optional(),
  annualFee: z.number().int().positive().nullable().optional(),
  examAccepted: z.nativeEnum(ExamType).optional(),
  averagePackage: z.number().positive().nullable().optional(),
  highestPackage: z.number().positive().nullable().optional(),
  placementYear: z.string().nullable().optional(),
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
    const parsed = programUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Verify program exists
    const programExists = await prisma.program.findUnique({
      where: { id }
    });
    if (!programExists) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Verify unique constraints if branchCode or examAccepted changes
    const collegeId = programExists.collegeId;
    const nextBranchCode = data.branchCode ?? programExists.branchCode;
    const nextExamAccepted = data.examAccepted ?? programExists.examAccepted;

    if (
      (data.branchCode && data.branchCode !== programExists.branchCode) ||
      (data.examAccepted && data.examAccepted !== programExists.examAccepted)
    ) {
      const duplicate = await prisma.program.findUnique({
        where: {
          collegeId_branchCode_examAccepted: {
            collegeId,
            branchCode: nextBranchCode,
            examAccepted: nextExamAccepted,
          }
        }
      });
      if (duplicate) {
        return NextResponse.json({ error: "Program with this branch and exam type already exists for this college" }, { status: 409 });
      }
    }

    const updated = await prisma.program.update({
      where: { id },
      data: {
        branchCode: data.branchCode,
        branchName: data.branchName,
        degree: data.degree,
        durationYears: data.durationYears,
        annualFee: data.annualFee !== undefined ? data.annualFee : undefined,
        examAccepted: data.examAccepted,
        averagePackage: data.averagePackage !== undefined ? data.averagePackage : undefined,
        highestPackage: data.highestPackage !== undefined ? data.highestPackage : undefined,
        placementYear: data.placementYear !== undefined ? data.placementYear : undefined,
      }
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
