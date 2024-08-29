import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { basicAuth } from '@/utils/basicAuth';

// Get the username and password from the environment variables
const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function POST(request: NextRequest) {
    const credentials = basicAuth(request);

    if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const data = await request.json();
        console.log('api/auth/correspondence/incoming-route-status route: ',  data[0] );

        // Validate the incoming data
        if (!data[0].status || !data[0].doctrackDocumentIncomingRouteId) {
            return NextResponse.json({ error: 'Missing required fields' }, {status:404});
        }

        // Check if the referenced incoming route exists
        const existingRoute = await prisma.doctrackDocumentIncomingRoute.findUnique({
            where: { id: data[0].doctrackDocumentIncomingRouteId }
        });

        if (!existingRoute) {
            return NextResponse.json({ error: 'Referenced incoming route does not exist' },{status:404});
        }

        // Create a new status record
        const result = await prisma.doctrackDocumentIncomingRouteStatus.create({
            data: {
                status: data[0].status,
                doctrackDocumentIncomingRoute: {
                    connect: { id: data[0].doctrackDocumentIncomingRouteId }
                }
            }
        });

        console.log("result:", result);
        return NextResponse.json({ result });
    } catch (error) {
        console.error('Error inserting document:', error);
        return NextResponse.json(error,{status:404});
    }
}
