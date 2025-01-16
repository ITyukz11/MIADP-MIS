import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);

    // Normalize the key to lowercase for case-insensitivity
    const params = Object.fromEntries(searchParams.entries());
    const wfpYear = params.WFPYear || params.WFPyear || params.wfpyear;

    console.log("Query Parameters:", params);
    console.log("Filtering by WFPYear:", wfpYear);

    // Fetch activities filtered by WFPYear
    const activities = await prisma.calendarOfActivity.findMany({
      where: {
        ...(wfpYear && { WFPYear: Number(wfpYear) }),
        individualActivity: false, // Add the individualActivity filter
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
    }, {});

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
