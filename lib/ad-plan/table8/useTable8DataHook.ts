import useSWR from "swr";

const fetchAllADPlanTable8 = async () => {
  try {
    const response = await fetch("/api/auth/ad-plan/table8", {
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

export const useADPlanTable8Data = () => {
  const { data, error, mutate } = useSWR(
    "/api/auth/ad-plan/table8",
    fetchAllADPlanTable8,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    adPlanTable8Data: data,
    adPlanTable8Loading: !error && !data,
    adPlanTable8Error: error,
    refetchAdPlanTable8: mutate, // Manually refetch when needed
  };
};
