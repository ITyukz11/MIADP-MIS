import prisma from "@/lib/prisma";
import { basicAuth } from "@/utils/basicAuth";
import { NextRequest, NextResponse } from "next/server";

// Get the username and password from the environment variables
const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function GET(request: NextRequest) {
    const credentials = basicAuth(request);

    if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const documents = await prisma.doctrackDocuments.findMany();
        return NextResponse.json({ documents });
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}