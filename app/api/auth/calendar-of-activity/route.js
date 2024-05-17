import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(request) {
  try {

    const userName = await getCurrentUser();
    
    const { authorizeOther, activityTitle, activityDescription, type, targetParticipant, 
            location, dateFrom, dateRange,timeRange,allDay,status,color,remarks,preparatoryList} = await request.json();
    console.log('api/auth/calendar-of-activity route: ', { authorizeOther,activityTitle, activityDescription, type, targetParticipant, 
      location, dateFrom, dateRange,timeRange,allDay,status,remarks,preparatoryList });

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
            dateRange,
            timeRange,
            allDay,
            status,
            color,
            remarks,
            preparatoryList: {
              createMany: {
                data: preparatoryList // Assuming preparatoryList is an array of objects
              }
            },
            user: {
              connect:{
                name: userName.name
              }
            }
          }
        });
    
        console.log({ newCalendarOfActivity });
    
        return NextResponse.json({ newCalendarOfActivity });
  } catch (error) {
    console.error('Error inserting new activity:', error);
    return NextResponse.json({ error: 'Internal server error. Error Message: ', error });
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
            region:true
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

