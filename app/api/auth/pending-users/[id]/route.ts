// app/api/pending-users/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.pendingUser.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[PATCH_PENDING_USER_STATUS]", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

// DELETE: Remove pending user by ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedUser = await prisma.pendingUser.delete({
      where: { id },
    });

    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    console.error("[DELETE_PENDING_USER]", error);
    return NextResponse.json(
      { error: "Failed to delete pending user" },
      { status: 500 }
    );
  }
}
