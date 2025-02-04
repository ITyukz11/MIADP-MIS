import useSWR from "swr";

const fetchAllActivities = async () => {
  try {
    const response = await fetch("/api/auth/calendar-of-activity", {
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

export const useActivitiesData = () => {
  const { data, error, mutate } = useSWR(
    "/api/auth/calendar-of-activity",
    fetchAllActivities,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    activitiesData: data,
    activityLoading: !error && !data,
    activityError: error,
    refetchActivities: mutate, // Manually refetch when needed
  };
};
