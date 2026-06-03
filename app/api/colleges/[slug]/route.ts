import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DATA_NOTICE =
  "Development demo data — verify official sources before counselling.";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        programs: {
          orderBy: { branchCode: "asc" },
          include: {
            cutoffs: {
              orderBy: [{ year: "desc" }, { round: "asc" }, { category: "asc" }],
              include: {
                source: true,
              },
            },
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found.", dataNotice: DATA_NOTICE },
        { status: 404 }
      );
    }

    return NextResponse.json({ college, dataNotice: DATA_NOTICE });
  } catch (error) {
    console.error("College detail API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
