import { PrismaClient } from '@prisma/client';
import { basicAuth } from '@/utils/basicAuth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function GET(req: NextRequest) {
  const credentials = basicAuth(req);

  console.log("credentials: ", credentials)
  if (!credentials || credentials.username !== AUTH_USERNAME || credentials.password !== AUTH_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized: Invalid credentials' }, { status: 401 });
  }

  try {

    const subprojectCode = await prisma.subProjectCode.findMany({
      
    });


    return NextResponse.json(subprojectCode);
  } catch (error:any) {
    console.error('Error fetching subproject datas:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { values } = await req.json();  // Destructure to extract the 'values' object

    console.log("Payload being sent:", values);

    // Validate the input
    if (!values) {
      return NextResponse.json({ message: 'Subproject Data is missing' }, { status: 400 });
    }

    // Insert the subproject data into the database
    const subproject = await prisma.subProjectCode.create({
      data: {
        ...values,  // Spread the values directly into the create method
      }
    });

    return NextResponse.json({ message: 'Subproject Data Inserted Successfully', subproject }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


