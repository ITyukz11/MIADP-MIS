import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(request) {
    try {
        // Step 1: Fetch all activities and associated user regions
        const calendarOfActivityParticipants = await prisma.calendarOfActivityParticipant.findMany();

        return NextResponse.json(calendarOfActivityParticipants);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
