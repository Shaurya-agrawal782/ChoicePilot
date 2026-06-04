import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { CollegeType } from "@prisma/client";

const collegeUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().optional(),
  type: z.nativeEnum(CollegeType).optional(),
  affiliation: z.string().nullable().optional(),
  approvalStatus: z.string().nullable().optional(),
  officialWebsite: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  hostelAvailable: z.boolean().nullable().optional(),
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
    const parsed = collegeUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Verify college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id }
    });
    if (!collegeExists) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Check slug duplication if updated
    if (data.slug && data.slug !== collegeExists.slug) {
      const existing = await prisma.college.findUnique({
        where: { slug: data.slug }
      });
      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
      }
    }

    const updated = await prisma.college.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        city: data.city,
        state: data.state,
        type: data.type,
        affiliation: data.affiliation !== undefined ? (data.affiliation || null) : undefined,
        approvalStatus: data.approvalStatus !== undefined ? (data.approvalStatus || null) : undefined,
        officialWebsite: data.officialWebsite !== undefined ? (data.officialWebsite || null) : undefined,
        overview: data.overview !== undefined ? (data.overview || null) : undefined,
        hostelAvailable: data.hostelAvailable !== undefined ? data.hostelAvailable : undefined,
      }
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
