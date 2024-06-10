import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(request) {
  try {

    //const userName = await getCurrentUser();

    const { authorizeOther, activityTitle, activityDescription, type, targetParticipant, participants,
      location, dateFrom, dateTo, timeStart, timeEnd, allDay, attachments, status, remarks, preparatoryList, userName } = await request.json();
    console.log('api/auth/calendar-of-activity route: ', {
      authorizeOther, activityTitle, activityDescription, type, targetParticipant, participants,
      location, dateFrom, dateTo, timeStart, timeEnd, allDay, attachments, status, remarks, preparatoryList, userName
    });

    // Create the new calendar of activity
    const newCalendarOfActivity = await prisma.calendarOfActivity.create({
      data: {
        authorizeOther,
        activityTitle,
        activityDescription,
        type,
        targetParticipant,
        location,
        dateFrom,
        dateTo,
        timeStart,
        timeEnd,
        allDay,
        attachments,
        status,
        remarks,
        preparatoryList: {
          createMany: {
            data: preparatoryList // Assuming preparatoryList is an array of objects
          }
        },
        user: {
          connect: {
            name: userName
          }
        },
        participants: {
          create: participants.map(participantId => ({
            user: {
              connect: {
                id: participantId
              }
            }
          }))
        }
      }
    });

    console.log({ newCalendarOfActivity });


    return NextResponse.json({ newCalendarOfActivity }, { status: 200 });
  } catch (error) {
    console.error('Error inserting new activity:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const ids = Array.isArray(id) ? id : [id];

    // Find the preparatory lists associated with the calendar activities
    const preparatoryLists = await prisma.preparatoryList.findMany({
      where: {
        activity: {
          in: ids
        }
      }
    });

    // Delete the preparatory lists
    await prisma.$transaction(
      preparatoryLists.map((preparatoryList) =>
        prisma.preparatoryList.delete({
          where: { id: preparatoryList.id }
        })
      )
    );

    // Delete the calendar activities
    const deletedActivities = await prisma.$transaction(
      ids.map((id) =>
        prisma.calendarOfActivity.delete({
          where: { id: id }
        })
      )
    );

    return NextResponse.json({ deletedActivities }, { status: 200 });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, newData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    const updatedActivity = await prisma.calendarOfActivity.update({
      where: { id: id },
      data: newData
    });

    return NextResponse.json({ updatedActivity },{ status: 200 });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}


export async function GET(request) {
  try {
    const calendarOfActivity = await prisma.calendarOfActivity.findMany({
      include: {
        user: {
          select: {
            component: true,
            unit: true,
            position: true,
            region: true,
            color: true
          }
        },
        calendarOfActivityHistory: true, // Include all fields from the calendarOfActivityHistory model
        preparatoryList: true // Include all fields from the preparatoryList model
      },
      cacheStrategy: { ttl: 3600, swr: 300 },
    });

    return new Response(JSON.stringify(calendarOfActivity), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching Calendar Of Activity:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

