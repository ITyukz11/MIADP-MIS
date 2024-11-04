// actions/getUserById.ts
export async function getUserById(userId: string) {
  try {
    // Use relative URL
    const response = await fetch(`/api/auth/user?id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const data = await response.json();
    return data; // Return the full user object
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw the error for further handling
  }
}
