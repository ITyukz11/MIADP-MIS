import useSWR from "swr";

const fetchAllC3IPOValidationData = async () => {
  try {
    const response = await fetch("/api/kobotoolbox", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const useC3IPOValidationData = () => {
  const { data, error, mutate } = useSWR(
    "/api/kobotoolbox",
    fetchAllC3IPOValidationData,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    C3IPOValidationData: data,
    C3IPOValidationLoading: !error && !data,
    C3IPOValidationError: error,
    refetchIPOValidation: mutate, // Manually refetch when needed
  };
};
