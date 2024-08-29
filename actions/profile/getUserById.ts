// actions/getUserById.ts
export async function getUserById(userId: string) {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`)
        },
        body: JSON.stringify({ userId })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
  
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }
  