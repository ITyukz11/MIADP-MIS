import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reports = await prisma.processDocReport.findMany({
      orderBy: {
        dateConducted: "desc", // Optional: orders reports by latest date
      },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const report = await prisma.processDocReport.create({
      data: {
        activityTitle: body.activityTitle,
        WFPActivity: body.WFPActivity,
        activityObjectives: body.activityObjectives,
        dateConducted: new Date(body.dateConducted),
        region: body.region,
        province: body.province,
        city: body.city,
        municipality: body.municipality,
        baranggay: body.baranggay,
        totalMaleIP: parseInt(body.totalMaleIP),
        totalFemaleIP: parseInt(body.totalFemaleIP),
        totalMaleNonIP: parseInt(body.totalMaleNonIP),
        totalFemaleNonIP: parseInt(body.totalFemaleNonIP),
        preActivity: body.preActivity,
        preOtherActivity: body.preOtherActivity || "",
        preActivityDescription: body.preActivityDescription,
        preActivityOutputQty: parseInt(body.preActivityOutputQty),
        preActivityOutputDescription: body.preActivityOutputDescription,
        preActivityOutcome: body.preActivityOutcome,
        preActivityEmergingImpact: body.preActivityEmergingImpact,
        during: body.during,
        duringOtherActivity: body.duringOtherActivity || "",
        duringDescription: body.duringDescription,
        duringOutputQty: parseInt(body.duringOutputQty),
        duringOutputDescription: body.duringOutputDescription,
        duringOutcome: body.duringOutcome,
        duringEmergingImpact: body.duringEmergingImpact,
        postActivity: body.postActivity,
        postOtherActivity: body.postOtherActivity || "",
        postActivityDescription: body.postActivityDescription,
        postActivityOutputQty: parseInt(body.postActivityOutputQty),
        postActivityOutputDescription: body.postActivityOutputDescription,
        postActivityOutcome: body.postActivityOutcome,
        postActivityEmergingImpact: body.postActivityEmergingImpact,
        attendanceSheet: body.attendanceSheet,
        program: body.program,
        photoDocumentation: body.photoDocumentation,
        participantsProfile: body.participantsProfile,
        presentationMaterials: body.presentationMaterials,
        preparedByName: body.preparedByName,
        reviewedByName: body.reviewedByName,
        notedByName: body.notedByName,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ success: false, message: "DB insert failed" }, { status: 500 });
  }
}

