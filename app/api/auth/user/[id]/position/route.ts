import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const userId = params.id;
  
    try {
      const body = await request.json();
      const { position } = body;
  
      if (!position || typeof position !== "string") {
        return NextResponse.json({ error: "Invalid position" }, { status: 400 });
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { position },
      });
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("[PATCH /api/users/[id]/position]", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
