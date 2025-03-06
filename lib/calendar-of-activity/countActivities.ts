import useSWR from "swr";
import axios from "axios";

const fetchCountActivities = async () => {
  try {
    const response = await axios.get("/api/activities/count-activities");
    return response.data;
  } catch (error) {
    console.error("Error fetching /api/activities/count-activities:", error);
    throw new Error("Internal Server Error");
  }
};

export const useActivitiesCountData = () => {
  const { data, error, mutate } = useSWR(
    "/api/activities/count-activities",
    fetchCountActivities,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000, // Cache the data for 1 minute
    }
  );

  return {
    activitiesCountData: data,
    activitiesCountLoading: !error && !data,
    activitiesCountError: error,
    refetchActivitiesCount: mutate, // Manually refetch when needed
  };
};
