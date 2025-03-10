import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("Running cron job to update activity statuses...");

    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    // Update to "Ongoing" if today is between dateFrom and dateTo, excluding Postponed and Cancelled
    await prisma.calendarOfActivity.updateMany({
      where: {
        dateFrom: { lte: today },
        dateTo: { gte: today },
        status: { notIn: ["Ongoing", "Postponed", "Cancelled"] },
      },
      data: { status: "Ongoing" },
    });

    console.log("Updated activities to Ongoing where applicable");

    // Update to "Completed" if today is after dateTo, excluding Postponed and Cancelled
    await prisma.calendarOfActivity.updateMany({
      where: {
        dateTo: { lt: today },
        status: { notIn: ["Completed", "Postponed", "Cancelled"] },
      },
      data: { status: "Completed" },
    });

    console.log("Updated activities to Completed where applicable");

    return NextResponse.json({
      message: "Activity statuses updated successfully",
    });
  } catch (error) {
    console.error("Error updating activity statuses:", error);
    return NextResponse.json(
      { error: "Failed to update activity statuses" },
      { status: 500 }
    );
  }
}
