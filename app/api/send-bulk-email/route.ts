import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!to || !subject || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const recipients = to.split(",").map((email) => email.trim());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const attachments = attachment
      ? [
          {
            filename: attachment.name,
            content: Buffer.from(await attachment.arrayBuffer()),
            contentType: attachment.type,
          },
        ]
      : [];

    const mailOptions = {
      from: `"MIADP MIS" <${process.env.GMAIL_USER}>`, // Change the sender's name here
      to: recipients,
      subject,
      text,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Bulk emails sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
