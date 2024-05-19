// pages/api/auth/signin.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  if (request.method === 'POST') {
    const { email, password } = await request.json();

    try {
      // Fetch user from database based on email
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Compare password with hashed password from database
      const passwordCorrect = password === user.password; // Use appropriate password comparison method (e.g., bcrypt)

      if (!passwordCorrect) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      // Return user data along with success response if authentication succeeds
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          region: user.region,
          unit: user.unit,
          component: user.component,
          position: user.position,
        },
      });
    } catch (error) {
      console.error('Error signing in:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // If the request method is not POST, return Method Not Allowed error
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
