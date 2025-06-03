import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Email not found." }, { status: 404 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await prisma.user.update({
    where: { email },
    data: {
      resetCode: code,
      resetCodeExpiry: expiry.toISOString(),
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MIADP MIS" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "MIADP MIS Password Reset Instructions",
    text: `Dear ${user.name},\n\nYour password reset code is: ${code}. This code is valid for 10 minutes. Please use it to reset your password.\n\nBest regards,\nMIADP MIS`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Reset code sent successfully." });
  } catch (error) {
    console.error("Error sending reset code:", error);
    return NextResponse.json({ error: "Failed to send reset code." }, { status: 500 });
  }
}
