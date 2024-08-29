import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {basicAuth} from '../../../../utils/basicAuth'

// Get the username and password from the environment variables
const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function POST(request: NextRequest) {

    const credentials = basicAuth(request);

    if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { date, encoder, from, subject, description, link, remarks, documentType, routeType, attachment, no, id } = await request.json();
        console.log('api/auth/new-document route: ', { date, encoder, from, subject, documentType, routeType, description, link, remarks, attachment, no, id });

        // Check if the user exists in the database
        const existingUser = await prisma.user.findFirst({ where: { id } });
        if (!existingUser) {
            return NextResponse.json({ error: 'You are not authorized to insert document' });
        }

        // Execute the query to create a new document
        const result = await prisma.doctrackDocuments.create({
            data: {
                user: {
                    connect: {
                      id: id
                    }
                  },
                subject,
                documentType,
                routeType,
                description,
                link: link || '', // Handle optional fields
                attachment: attachment || '',
                from,

                date: date || new Date().toISOString(), // Handle optional fields
                remarks: remarks || '',
                encoder: encoder || 'default_encoder', // Provide a default or required value
            }
        });

        console.log("result:", result);
        return NextResponse.json({ result });
    } catch (error) {
        console.error('Error inserting document:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

