import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request) {
    const { email, newPassword } = await request.json();

    try {
        if (!email || !newPassword) {
            return NextResponse.json({ success: false, message: "Email and new password are required" }, { status: 400 });
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await prisma.user.update({
            where: { email },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
