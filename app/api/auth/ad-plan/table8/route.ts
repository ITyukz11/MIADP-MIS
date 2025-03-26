import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const table8 = await prisma.table8Tracker.findMany({
      orderBy: { createdAt: "desc" }, // Fetch data in descending order (latest first)
    });

    return NextResponse.json(table8);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
