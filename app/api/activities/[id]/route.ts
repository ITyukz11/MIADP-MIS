import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  const id = context.params?.id;

  if (!id) {
    return new NextResponse("Missing ID", { status: 400 });
  }

  try {
    const activity = await prisma.calendarOfActivity.findUnique({
      where: { id },
      include: {
        user: true,
        participants: true,
        calendarOfActivityAttachment: true,
        preparatoryList: true
      }
    });

    if (!activity) {
      return new NextResponse("Activity not found", { status: 404 });
    }

    return NextResponse.json(activity);

  } catch (error) {
    console.error("[ACTIVITY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

