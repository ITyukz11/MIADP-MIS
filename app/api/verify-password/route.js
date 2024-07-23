import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request) {
    const { email, password } = await request.json();

    try {
        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Compare the entered password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
        }

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error('Error confirming password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
