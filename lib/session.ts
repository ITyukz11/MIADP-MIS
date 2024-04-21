import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user;
  } catch (error) {
    console.error("Error retrieving current user session:", error);
    return null; // Or handle the error appropriately
  }
}
