import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract query parameters safely
    const { searchParams } = new URL(request.url);

    // Normalize the key to lowercase for case-insensitivity
    const wfpYear =
      searchParams.get("WFPYear") ||
      searchParams.get("WFPyear") ||
      searchParams.get("wfpyear");

    console.log("Filtering by WFPYear:", wfpYear);

    // Fetch activities filtered by WFPYear
    const activities = await prisma.calendarOfActivity.findMany({
      where: {
        ...(wfpYear ? { WFPYear: String(wfpYear) } : {}), // Convert wfpYear to a string
        individualActivity: false, // Exclude individual activities
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

    // Count activities by region and component
    const countsByRegionAndComponent = activities.reduce<
      Record<string, Record<string, number>>
    >((acc, activity) => {
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
