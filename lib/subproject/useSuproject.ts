import useSWR from "swr";

const fetchSubproject = async () => {
  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME;
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;
  const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

  try {
    const response = await fetch("/api/subproject", {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching count subproject:", error);
    throw error;
  }
};

export const useSubprojectData = () => {
  const { data, error, mutate } = useSWR("/api/subproject", fetchSubproject, {
    revalidateOnFocus: false, // Prevent re-fetching on tab focus
    revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
    refreshInterval: 0, // Disable polling
    dedupingInterval: 60 * 1000,
  });

  return {
    subprojectData: data,
    subprojectLoading: !error && !data,
    subprojectError: error,
    refetchSubprojectData: mutate, // Manually refetch when needed
  };
};
