import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { basicAuth } from "@/utils/basicAuth";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(req: NextRequest) {
  const credentials = basicAuth(req);

  if (
    !credentials ||
    credentials.username !== process.env.BASIC_AUTH_USERNAME_DATACENTER ||
    credentials.password !== process.env.BASIC_AUTH_PASSWORD_DATACENTER
  ) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const includeUser = req.nextUrl.searchParams.get("includeUser") === "true";
  const includeParticipants =
    req.nextUrl.searchParams.get("includeParticipants") === "true";
  const includeHistory =
    req.nextUrl.searchParams.get("includeHistory") === "true";
  const includeAttachments =
    req.nextUrl.searchParams.get("includeAttachments") === "true";
  const includePreparatoryList =
    req.nextUrl.searchParams.get("includePreparatoryList") === "true";
  const includePreparatoryContent =
    req.nextUrl.searchParams.get("includePreparatoryContent") === "true";

  try {
    const calendarOfActivity = await prisma.calendarOfActivity.findMany({
      select: {
        WFPYear: true,
        activityTitle: true,
        activityDescription: true,
        type: true,
        otherType: true,
        targetParticipant: true,
        location: true,
        dateFrom: true,
        dateTo: true,
        timeStart: true,
        timeEnd: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        preparatoryContent: includePreparatoryContent,
        user: includeUser
          ? {
              select: {
                component: true,
                unit: true,
                position: true,
                region: true,
              },
            }
          : false,
        participants: includeParticipants,
        calendarOfActivityHistory: includeHistory,
        calendarOfActivityAttachment: includeAttachments
          ? {
              select: {
                details: true,
                link: true,
              },
            }
          : false,
        preparatoryList: includePreparatoryList
          ? {
              select: {
                description: true,
                status: true,
              },
            }
          : false,
      },

      cacheStrategy: { ttl: 3600, swr: 300 },
    });

    return NextResponse.json(calendarOfActivity, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Calendar Of Activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
