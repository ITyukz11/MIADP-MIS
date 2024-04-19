import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { hash } from 'bcrypt';



export async function POST(request: Request) {
  try {


    const { region, fullname, email, password } = await request.json();

    console.log('api/auth/register route: ', { fullname, email, password });

    // Check if the email already exists in the database
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (existingUser.rows.length > 0) {
      // If the email already exists, return an error response
      return NextResponse.json({ error: 'Email already exists' });
    }

    // Hash the password  
    const hashedPassword = await hash(password, 10);

    // Insert the new user if the email is not duplicate
    const response = await sql`
      INSERT INTO users (region, fullname, email, password)
      VALUES (${region},${fullname}, ${email}, ${hashedPassword});
    `;

    return NextResponse.json({ message: 'success' });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal server error' });
  }
}
