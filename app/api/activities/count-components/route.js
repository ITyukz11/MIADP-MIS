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
                        component: true,
                        region:true
                    },
                },
            },
        });

        const countsByRegionAndComponent = activities.reduce((acc, activity) => {
            const { region, component } = activity.user;

            if (!acc[region]) {
                acc[region] = {}; // Initialize an empty object for the region
            }

            if (!acc[region][component]) {
                acc[region][component] = 0; // Initialize count for the component in this region
            }

            acc[region][component] += 1; // Increment count for the component

            return acc;
        }, {});

        return NextResponse.json(countsByRegionAndComponent);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
