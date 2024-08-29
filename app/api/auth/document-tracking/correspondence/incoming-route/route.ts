import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { basicAuth } from '@/utils/basicAuth';

const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function POST(request: NextRequest) {
    const credentials = basicAuth(request);

    if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { documentId, senderId, subject, purpose, remarks, to } = await request.json();

        // Step 1: Ensure that the `DoctrackDocuments` entry exists and get its ID
        const document = await prisma.doctrackDocuments.findUnique({
            where: { id: documentId },
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // Step 2: Create a new entry in `DoctrackDocumentIncomingRoute`
        const incomingRoute = await prisma.doctrackDocumentIncomingRoute.create({
            data: {
                user:{
                    connect:{
                        id:senderId
                    }
                },
                subject,
                purpose,
                remarks,
                document: {
                    connect: { id: documentId }
                },
                doctrackDocumentIncomingRouteTo: {
                    create: {
                        receiver: to,
                        sender: senderId
                    }
                },
                doctrackDocumentIncomingRouteStatus: {
                    create: {
                        status: `Forwarded to ${to}`
                    }
                },
            },
        });

        return NextResponse.json({ incomingRoute });
    } catch (error) {
        console.error('Error inserting incoming route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const credentials = basicAuth(request);

    if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const incomingRoute = await prisma.doctrackDocumentIncomingRoute.findMany(
            {
                include: {
                    doctrackDocumentIncomingRouteTo:{
                        select:{
                            doctrackDocumentIncomingRouteId:true,
                            receiver:true,
                            sender:true,
                            createdAt:true
                        }
                    },
                    doctrackDocumentIncomingRouteStatus: {
                        select: {
                            doctrackDocumentIncomingRouteId:true,
                            status:true,
                            createdAt:true
                        },
                    },
                   
                },
            }
        );

        return NextResponse.json({ incomingRoute });
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}