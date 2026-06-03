import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  programId: z.string().min(1, "Program ID is required."),
});

const deleteSchema = z.object({
  programId: z.string().min(1, "Program ID is required."),
});

async function readJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const saved = await prisma.savedRoute.findMany({
      where: { userId: session.user.id },
      include: {
        program: {
          include: {
            college: true,
            cutoffs: {
              orderBy: [{ year: "desc" }, { round: "asc" }],
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Saved routes GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await readJson(request);
    if (body === null) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { programId } = parsed.data;

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Programme does not exist." },
        { status: 400 }
      );
    }

    const existing = await prisma.savedRoute.findUnique({
      where: {
        userId_programId: {
          userId: session.user.id,
          programId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, saved: existing });
    }

    const saved = await prisma.savedRoute.create({
      data: {
        userId: session.user.id,
        programId,
      },
    });

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error("Saved routes POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await readJson(request);
    if (body === null) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { programId } = parsed.data;

    const result = await prisma.savedRoute.deleteMany({
      where: {
        userId: session.user.id,
        programId,
      },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Saved routes DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
