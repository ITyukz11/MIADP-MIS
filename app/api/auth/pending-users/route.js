import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export async function POST(request) {
  try {
    const { region, fullname, email, password } = await request.json();
    console.log('api/auth/pending-users route: ', { region, fullname, email, password });

    // Check if the email already exists in the user table
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // Check if the email already exists in the pendingUser table
    const existingPendingUser = await prisma.pendingUser.findUnique({ where: { email } });

    // Check if the email exists in either the user or pendingUser table
    if (existingUser || existingPendingUser) {
      return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }else{
      const hashedPassword = await hash(password, 10);

      const response = await prisma.pendingUser.create({
        data: {
          region,
          name: fullname,
          email,
          password: hashedPassword,
        }
      });
  
      return new Response(JSON.stringify({ response }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

 
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET() {
  try {
    const pendingUsers = await prisma.pendingUser.findMany({  
      cacheStrategy: { ttl: 3600, swr: 300 },  
    });
    return new Response(JSON.stringify(pendingUsers), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
