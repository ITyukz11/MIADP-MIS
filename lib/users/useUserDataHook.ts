import useSWR from "swr";

const fetchUsers = async () => {
  try {
    const response = await fetch("/api/auth/user", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const useUsersData = () => {
  const { data, error, mutate } = useSWR("/api/auth/user", fetchUsers, {
    revalidateOnFocus: false, // Prevent re-fetching on tab focus
    revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
    refreshInterval: 0, // Disable polling
    dedupingInterval: 60 * 1000,
  });

  return {
    usersData: data,
    usersLoading: !error && !data,
    usersError: error,
    refetchUsers: mutate, // Manually refetch when needed
  };
};
