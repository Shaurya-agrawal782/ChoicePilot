import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { CollegeType } from "@prisma/client";

const collegeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  city: z.string().min(1, "City is required"),
  state: z.string().default("Madhya Pradesh"),
  type: z.nativeEnum(CollegeType),
  affiliation: z.string().nullable().optional(),
  approvalStatus: z.string().nullable().optional(),
  officialWebsite: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  hostelAvailable: z.boolean().nullable().optional(),
});

export async function GET() {
  const authCheck = await verifyAdmin();
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const colleges = await prisma.college.findMany({
      include: {
        programs: {
          orderBy: { branchCode: "asc" },
          include: {
            cutoffs: {
              orderBy: [{ year: "desc" }, { round: "asc" }, { category: "asc" }],
              include: {
                source: true
              }
            }
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(colleges);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authCheck = await verifyAdmin();
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await req.json();
    const parsed = collegeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Check slug duplication
    const existing = await prisma.college.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const college = await prisma.college.create({
      data: {
        name: data.name,
        slug: data.slug,
        city: data.city,
        state: data.state,
        type: data.type,
        affiliation: data.affiliation || null,
        approvalStatus: data.approvalStatus || null,
        officialWebsite: data.officialWebsite || null,
        overview: data.overview || null,
        hostelAvailable: data.hostelAvailable ?? null,
      }
    });

    return NextResponse.json(college, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
