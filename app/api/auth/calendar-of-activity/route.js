import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request) {
  try {
    //const userName = await getCurrentUser();

    const {
      authorizeOther,
      individualActivity,
      WFPYear,
      activityTitle,
      activityDescription,
      type,
      otherType,
      targetParticipant,
      participants,
      location,
      dateFrom,
      dateTo,
      timeStart,
      timeEnd,
      allDay,
      attachments,
      status,
      remarks,
      preparatoryContent,
      preparatoryList,
      calendarOfActivityAttachment,
      userName,
    } = await request.json();
    console.log("api/auth/calendar-of-activity route: ", {
      authorizeOther,
      individualActivity,
      WFPYear,
      activityTitle,
      activityDescription,
      type,
      otherType,
      targetParticipant,
      participants,
      location,
      dateFrom,
      dateTo,
      timeStart,
      timeEnd,
      allDay,
      attachments,
      status,
      remarks,
      preparatoryContent,
      preparatoryList,
      calendarOfActivityAttachment,
      userName,
    });

    // Create the new calendar of activity
    const newCalendarOfActivity = await prisma.calendarOfActivity.create({
      data: {
        authorizeOther,
        individualActivity,
        WFPYear,
        activityTitle,
        activityDescription,
        type,
        otherType,
        targetParticipant,
        location,
        dateFrom,
        dateTo,
        timeStart,
        timeEnd,
        allDay,
        status,
        remarks,
        preparatoryContent,
        calendarOfActivityAttachment: {
          createMany: {
            data: calendarOfActivityAttachment,
          },
        },
        preparatoryList: {
          createMany: {
            data: preparatoryList, // Assuming preparatoryList is an array of objects
          },
        },
        user: {
          connect: {
            name: userName,
          },
        },
        participants: {
          createMany: {
            data: participants, // Assuming preparatoryList is an array of objects
          },
        },
      },
    });

    console.log({ newCalendarOfActivity });

    // Return the created calendar of activity along with its ID
    return NextResponse.json({ newCalendarOfActivity, id: newCalendarOfActivity.id }, { status: 200 });
  } catch (error) {
    console.error("Error inserting new activity:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const ids = Array.isArray(id) ? id : [id];

    // Find the preparatory lists associated with the calendar activities
    const preparatoryLists = await prisma.preparatoryList.findMany({
      where: {
        activity: {
          in: ids,
        },
      },
    });

    const calendarOfActivityAttachments =
      await prisma.calendarOfActivityAttachments.findMany({
        where: {
          activity: {
            in: ids,
          },
        },
      });

    // Find the preparatory lists associated with the calendar activities
    const participants = await prisma.calendarOfActivityParticipant.findMany({
      where: {
        calendarOfActivityId: {
          in: ids,
        },
      },
    });

    // Delete the preparatory lists
    await prisma.$transaction(
      preparatoryLists.map((preparatoryList) =>
        prisma.preparatoryList.delete({
          where: { id: preparatoryList.id },
        })
      )
    );

    await prisma.$transaction(
      calendarOfActivityAttachments.map((attachments) =>
        prisma.calendarOfActivityAttachments.delete({
          where: { id: attachments.id },
        })
      )
    );

    // Delete the participants
    await prisma.$transaction(
      participants.map((participant) =>
        prisma.calendarOfActivityParticipant.delete({
          where: {
            calendarOfActivityId_userId: {
              calendarOfActivityId: participant.calendarOfActivityId,
              userId: participant.userId,
            },
          },
        })
      )
    );

    // Delete the calendar activities
    const deletedActivities = await prisma.$transaction(
      ids.map((id) =>
        prisma.calendarOfActivity.delete({
          where: { id: id },
        })
      )
    );

    return NextResponse.json({ deletedActivities }, { status: 200 });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, newData } = await request.json();

    // Log incoming request data
    console.log("Received request data:");
    console.log("ID:", id);
    console.log("New Data:", newData);

    if (!id) {
      console.log("Error: ID is missing.");
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    // Check if the record exists
    const existingActivity = await prisma.calendarOfActivity.findUnique({
      where: { id: id },
    });

    console.log("Existing activity before update:", existingActivity);

    if (!existingActivity) {
      console.log("Error: Record not found.");
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    // Log new data to be updated
    console.log("Attempting to update activity with data:", newData);

    // Perform the update operation
    const updatedActivity = await prisma.calendarOfActivity.update({
      where: { id: id },
      data: newData,
    });

    console.log("Activity successfully updated:", updatedActivity);

    return NextResponse.json({ updatedActivity }, { status: 200 });
  } catch (error) {
    console.error("Error during update operation:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
    }
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const calendarOfActivity = await prisma.calendarOfActivity.findMany({
      include: {
        user: {
          select: {
            id: true,
            component: true,
            unit: true,
            position: true,
            region: true,
            color: true,
          },
        },
        participants: true, // Include all fields from the preparatoryList model
        calendarOfActivityHistory: true, // Include all fields from the calendarOfActivityHistory model
        calendarOfActivityAttachment: true, //Include all calendar of activities attachments
        preparatoryList: true, // Include all fields from the preparatoryList model
      },
      cacheStrategy: { ttl: 3600, swr: 300 },
    });

    return new Response(JSON.stringify(calendarOfActivity), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Calendar Of Activity:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
