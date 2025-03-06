import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const componentData = url.searchParams.get("component");

  const today = new Date();
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );

  try {
    console.log("Received Component Parameter:", componentData);

    const subprojectCodeCount = await prisma.subProjectCode.count({
      where: {
        component: componentData
          ? { equals: componentData, mode: "insensitive" }
          : undefined,
      },
    });

    const recentlyAddedCount = await prisma.subProjectCode.count({
      where: {
        AND: [
          componentData
            ? { component: { equals: componentData, mode: "insensitive" } }
            : {},
          { createdAt: { gte: firstDayOfCurrentMonth } },
        ],
      },
    });

    return NextResponse.json({
      count: subprojectCodeCount,
      recentlyAdded: recentlyAddedCount,
    });
  } catch (error: any) {
    console.error("Error counting subproject codes:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
