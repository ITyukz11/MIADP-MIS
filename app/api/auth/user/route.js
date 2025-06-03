import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(request) {
  try {
    const { email, expoPushToken } = await request.json();
    console.log('api/auth/user route: ', { email, expoPushToken });

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
    }

    // Update the user's expo push token
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { expoPushToken },
    });

    console.log('Updated user:', updatedUser);
    return NextResponse.json({ success: true, updatedUser });
  } catch (error) {
    console.error('Error updating expo push token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a specific user by ID
      const user = await prisma.user.findUnique({
        where: { id: id }, // Make sure to convert id to a number
        select: {
          id: true,
          region: true,
          name: true,
          unit: true,
          component: true,
          position: true,
          email: true,
          color: true,
          expoPushToken: true,
          notification: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          CalendarOfActivityParticipant: true,
          active:true,
          dateSeparated:true
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } else {
      // Fetch all users if no ID is provided
      const users = await prisma.user.findMany({
        select: {
          id: true,
          region: true,
          name: true,
          unit: true,
          component: true,
          position: true,
          email: true,
          color: true,
          expoPushToken: true,
          notification: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          active:true,
          dateSeparated:true,
          CalendarOfActivityParticipant: true,
        },
        cacheStrategy: { ttl: 3600, swr: 300 },
      });

      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
