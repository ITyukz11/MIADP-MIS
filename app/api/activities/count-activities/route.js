import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET(request) {
    try {
        // Step 1: Fetch all activities and associated user regions
        const activities = await prisma.calendarOfActivity.findMany({
            include: {
                user: {
                    select: {
                        region: true,
                    },
                },
            },
        });

        // Step 2: Count activities by region
        const countsByRegion = activities.reduce((acc, activity) => {
            const region = activity.user.region;
            if (!acc[region]) {
                acc[region] = 0;
            }
            acc[region] += 1;
            return acc;
        }, {});

        return NextResponse.json(countsByRegion);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
