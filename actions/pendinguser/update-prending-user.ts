export async function updatePendingUserStatus(id: string, status: string) {
  try {
    const res = await fetch(`/api/auth/pending-users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update status");
    }

    return await res.json(); // returns the updated PendingUser
  } catch (error) {
    console.error("Error updating pending user status:", error);
    throw error;
  }
}
