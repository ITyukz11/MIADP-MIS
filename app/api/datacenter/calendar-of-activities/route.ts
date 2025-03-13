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

  const dateFrom = req.nextUrl.searchParams.get("dateFrom");
  const dateTo = req.nextUrl.searchParams.get("dateTo");
  const type = req.nextUrl.searchParams.get("type");
  const WFPYear = req.nextUrl.searchParams.get("WFPYear");
  const status = req.nextUrl.searchParams.get("status");
  const component = req.nextUrl.searchParams.get("component");
  const unit = req.nextUrl.searchParams.get("unit");
  const region = req.nextUrl.searchParams.get("region");

  try {
    const calendarOfActivity = await prisma.calendarOfActivity.findMany({
      where: {
        individualActivity: false,
        dateFrom: dateFrom ? { gte: dateFrom } : undefined,
        dateTo: dateTo ? { lte: dateTo } : undefined,
        type: type || undefined,
        WFPYear: WFPYear || undefined,
        status: status || undefined,
        user: {
          component: component || undefined,
          unit: unit || undefined,
          region: region || undefined,
        },
      },
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
          : undefined,
        participants: includeParticipants || undefined,
        calendarOfActivityHistory: includeHistory || undefined,
        calendarOfActivityAttachment: includeAttachments
          ? {
              select: {
                details: true,
                link: true,
              },
            }
          : undefined,
        preparatoryList: includePreparatoryList
          ? {
              select: {
                description: true,
                status: true,
              },
            }
          : undefined,
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
