import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { basicAuth } from "@/utils/basicAuth"; // adjust path if needed
import { NextRequest } from "next/server";

const prisma = new PrismaClient().$extends(withAccelerate());

const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME;
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export async function POST(request: NextRequest) {
  const credentials = basicAuth(request);

  if (
    !credentials ||
    credentials.username !== AUTH_USERNAME ||
    credentials.password !== AUTH_PASSWORD
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const {
      region,
      fullname,
      email,
      component,
      unit,
      position,
      color,
      password,
    }: {
      region: string;
      fullname: string;
      email: string;
      component: string;
      unit: string;
      position: string;
      color: string;
      password: string;
    } = await request.json();

    console.log("api/auth/pending-users POST: ", {
      region,
      fullname,
      email,
      component,
      unit,
      position,
      color,
      password,
    });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingPendingUser = await prisma.pendingUser.findUnique({
      where: { email },
    });

    if (existingUser || existingPendingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await prisma.pendingUser.create({
      data: {
        region,
        component,
        unit,
        position,
        color,
        name: fullname,
        email,
        password, // you can hash here if needed: await hash(password, 10)
      },
    });

    return new Response(JSON.stringify({ response }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request: NextRequest) {
  const credentials = basicAuth(request);

  if (
    !credentials ||
    credentials.username !== AUTH_USERNAME ||
    credentials.password !== AUTH_PASSWORD
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const pendingUsers = await prisma.pendingUser.findMany({
      orderBy: {
        createdAt: "desc", // Latest first
      },
      cacheStrategy: { ttl: 3600, swr: 300 },
    });

    return new Response(JSON.stringify(pendingUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
