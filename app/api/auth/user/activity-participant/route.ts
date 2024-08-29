import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function GET(request: NextRequest) {
  try {
    const usersWithActivities = await prisma.user.findMany({
      select: {
        id: true,
        region: true,
        name: true,
        unit: true,
        component: true,
        position: true,
        email: true,
        _count: {
          select: {
            CalendarOfActivityParticipant: true,
          },
        },
      },
      cacheStrategy: { ttl: 3600, swr: 300 },
    });

    const result = usersWithActivities.map(user => ({
      id: user.id,
      region: user.region,
      name: user.name,
      unit: user.unit,
      component: user.component,
      position: user.position,
      email: user.email,
      totalActivities: user._count.CalendarOfActivityParticipant,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}
