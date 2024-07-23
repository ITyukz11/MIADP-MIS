import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request) {
    try {
        const { name, email, position, unit, component, region } = await request.json();
        console.log({ name, email, position, unit, component, region })
        // Fetch the user from the database
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Update the user's profile in the database
        await prisma.user.update({
            where: { email },
            data: {
                name: name,
                email: email,
                position: position,
                unit: unit,
                component: component,
                region: region
            },
        });

        return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
