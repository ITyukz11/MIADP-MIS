import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wfpYear = params.id;

    console.log("Filtering by WFPYear:", wfpYear);

    // Fetch activities filtered by WFPYear
    const activities = await prisma.calendarOfActivity.findMany({
      where: {
        WFPYear: wfpYear,
        individualActivity: false,
      },
      include: {
        user: {
          select: {
            component: true,
            region: true,
          },
        },
      },
    });

    const countsByRegionAndComponent = activities.reduce((acc, activity) => {
      const { region, component } = activity.user;

      if (!acc[region]) {
        acc[region] = {};
      }

      if (!acc[region][component]) {
        acc[region][component] = 0;
      }

      acc[region][component] += 1;

      return acc;
    }, {} as Record<string, Record<string, number>>);

    return NextResponse.json(countsByRegionAndComponent);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
