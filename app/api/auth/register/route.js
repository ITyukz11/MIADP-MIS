import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { region, fullname, email, password } = await request.json();
    console.log('api/auth/register route: ', { region, fullname, email, password });

    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const response = await prisma.user.create({
      data: {
        region,
        name: fullname,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal server error' });
  }
}
