import useSWR from "swr";

const fetchCountSubproject = async () => {
  try {
    const response = await fetch("/api/subproject/count", {
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

export const useSubprojectCountData = () => {
  const { data, error, mutate } = useSWR(
    "/api/subproject/count",
    fetchCountSubproject,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    subprojectCountData: data,
    subprojectCountLoading: !error && !data,
    subprojectCountError: error,
    refetchSubprojectCount: mutate, // Manually refetch when needed
  };
};
