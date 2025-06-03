import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, code, verifyOnly, newPassword } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (!user.resetCode || user.resetCode !== code) {
    return NextResponse.json({ error: "Invalid reset code." }, { status: 400 });
  }

  if (!user.resetCodeExpiry || new Date() > new Date(user.resetCodeExpiry)) {
    return NextResponse.json({ error: "Reset code expired." }, { status: 400 });
  }

  if (verifyOnly) {
    // Just verifying the code is valid
    return NextResponse.json({ message: "Code verified." });
  }

  // If updating password
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiry: null,
    },
  });

  return NextResponse.json({ message: "Password updated successfully." });
}
