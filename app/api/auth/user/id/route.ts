import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { NextRequest, NextResponse } from 'next/server';
import { basicAuth } from "@/utils/basicAuth";

const prisma = new PrismaClient().$extends(withAccelerate());

// Get the username and password from the environment variables
const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function GET(request: NextRequest) {
  const credentials = basicAuth(request);

  if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await request.json();

    if (!data.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: data.userId },
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
      },
      cacheStrategy: { ttl: 3600, swr: 300 }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
