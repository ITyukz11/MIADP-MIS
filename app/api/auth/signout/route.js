// pages/api/auth/signout.js
import { NextResponse } from 'next/server';
import { signOut } from 'next-auth/react';

export async function POST(request) {
  if (request.method === 'POST') {
    try {
      // Sign out the user
      await signOut({ redirect: false }); // Disable redirection

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error signing out:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // If the request method is not POST, return Method Not Allowed error
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
