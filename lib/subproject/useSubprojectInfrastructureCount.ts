import useSWR from "swr";

const fetchCountSubprojectInfrastructureData = async () => {
  try {
    const response = await fetch(
      "/api/subproject/count?component=infrastructure",
      {
        method: "GET",
      }
    );

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

export const useSubprojectInfrastructureCountData = () => {
  const { data, error, mutate } = useSWR(
    "/api/subproject/count?component=infrastructure",
    fetchCountSubprojectInfrastructureData,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    subprojectCountInfrastructureData: data,
    subprojectCountInfrastructureLoading: !error && !data,
    subprojectCountInfrastructureError: error,
    refetchSubprojectInfrastructureCount: mutate, // Manually refetch when needed
  };
};
