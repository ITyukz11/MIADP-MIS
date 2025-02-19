import useSWR from "swr";

const fetchPendingUsers = async (url: string) => {
  const username = "MIADP";
  const password = "test";
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString(
    "base64"
  )}`;

  const response = await fetch(url, {
    headers: {
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pending users");
  }

  return response.json();
};

export const usePendingUsersData = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/auth/pending-users",
    fetchPendingUsers,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    pendingUsersData: data,
    pendingUsersLoading: !error && !data && !isLoading,
    pendingUsersError: error,
    refetchPendingUserData: mutate,
  };
};
