import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, reason, confirmation } = await req.json();

    if (!email || !reason || confirmation !== true) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const deletionRequest = await prisma.deletionRequest.create({
      data: {
        email,
        reason,
        confirmation: true,
      },
    });

    return NextResponse.json(deletionRequest, { status: 201 });
  } catch (error: any) {
    console.error("Account deletion request failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
