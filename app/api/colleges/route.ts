import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CollegeType, BranchCode, Prisma } from "@prisma/client";

const querySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  type: z.nativeEnum(CollegeType).optional(),
  branch: z.nativeEnum(BranchCode).optional(),
  maxFee: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().positive().optional()
  ),
  page: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().positive().default(1)
  ),
  limit: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().int().positive().max(20).default(10)
  ),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const parsed = querySchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { search, city, type, branch, maxFee, page, limit } = parsed.data;

    const searchFilter: Prisma.CollegeWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const cityFilter: Prisma.CollegeWhereInput = city
      ? { city: { equals: city, mode: "insensitive" } }
      : {};

    const typeFilter: Prisma.CollegeWhereInput = type ? { type } : {};

    const programFilter: Prisma.ProgramWhereInput = {};
    if (branch) {
      programFilter.branchCode = branch;
    }
    if (maxFee) {
      programFilter.annualFee = { lte: maxFee };
    }

    const whereClause: Prisma.CollegeWhereInput = {
      AND: [
        searchFilter,
        cityFilter,
        typeFilter,
        Object.keys(programFilter).length > 0
          ? { programs: { some: programFilter } }
          : {},
      ],
    };

    const skip = (page - 1) * limit;

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where: whereClause }),
      prisma.college.findMany({
        where: whereClause,
        include: {
          programs: {
            where: programFilter,
            include: {
              cutoffs: {
                include: {
                  source: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      colleges,
      pagination: { page, limit, total, totalPages },
      dataNotice:
        "Development demo data — verify official sources before counselling.",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
