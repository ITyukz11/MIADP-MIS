import useSWR from "swr";

const fetchCountSubprojectEnterpriseData = async () => {
  try {
    const response = await fetch("/api/subproject/count?component=enterprise", {
      method: "GET",
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

export const useSubprojectEnterpriseCountData = () => {
  const { data, error, mutate } = useSWR(
    "/api/subproject/count?component=enterprise",
    fetchCountSubprojectEnterpriseData,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    subprojectCountEnterpriseData: data,
    subprojectCountEnterpriseLoading: !error && !data,
    subprojectCountEnterpriseError: error,
    refetchSubprojectEnterpriseCount: mutate, // Manually refetch when needed
  };
};
