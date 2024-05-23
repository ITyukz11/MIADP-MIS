import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { region, component, unit, position, color, fullname, email, password } = await request.json();
    console.log('api/auth/register route: ', { region, component, unit, position, color, fullname, email, password });

    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' });
    }


    // Execute both queries within a transaction
    const result = await prisma.$transaction([
      // Create the new user
      prisma.user.create({
        data: {
          region,
          component, 
          unit, 
          position,
          color,
          name: fullname,
          email,
          password
        }
      }),
      // Update the status of the pending user to "approved"
      prisma.pendingUser.update({
        where: { email }, // Assuming email is unique and used as the identifier
        data: { status: 'Approved' },
      })
    ]);

    // Extract the results of the queries
    const [newUser, updatedPendingUser] = result;
    console.log({ newUser, updatedPendingUser })
    return NextResponse.json({ newUser, updatedPendingUser });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal server error' });
  }
}
