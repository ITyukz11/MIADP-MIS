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
