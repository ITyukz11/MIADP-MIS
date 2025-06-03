import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const body = await request.json();
    const { active, dateSeparated } = body;

    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: 'Invalid "active" value' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        active,
        dateSeparated: active
          ? null
          : dateSeparated || new Date().toISOString(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PATCH /api/users/[id]/status]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
