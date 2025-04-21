// lib/actions/pendingUserActions.ts

export async function deletePendingUser(id: string) {
  try {
    const res = await fetch(`/api/auth/pending-users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete pending user");
    }

    return await res.json();
  } catch (error) {
    console.error("deletePendingUser error:", error);
    throw error;
  }
}
