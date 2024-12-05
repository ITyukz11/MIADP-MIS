import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Parse the query parameter from the request URL
  const url = new URL(request.url);
  const componentData = url.searchParams.get('component'); // Retrieve the 'component' from query parameters

  try {
    console.log('Received Component Parameter:', componentData);

    // Debugging: Check for data matching the filter
    if (componentData) {
      const testQuery = await prisma.subProjectCode.findMany({
        where: {
          component: componentData,
        },
      });
      console.log('Matching Records:', testQuery);
    }

    // Count the subproject codes, applying a filter if 'component' is provided
    const subprojectCodeCount = await prisma.subProjectCode.count({
      where: componentData
        ? {
          component: {
            equals: componentData,
            mode: 'insensitive',
          },
        }
        : undefined, // Count all if no filter
    });

    return NextResponse.json({ count: subprojectCodeCount });
  } catch (error: any) {
    console.error('Error counting subproject codes:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
