import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request) {
    const { email, password, newPassword } = await request.json();

    try {
        if (!email || !password || !newPassword) {
            return NextResponse.json({ success: false, message: "Email, current password, and new password are required" }, { status: 400 });
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Compare the entered current password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 401 });
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
