import useSWR from "swr";
import axios from "axios";

const fetchCountComponentsActivities = async () => {
  try {
    const response = await axios.get("/api/activities/count-components");
    return response.data;
  } catch (error) {
    console.error("Error fetching /api/activities/count-components:", error);
    throw new Error("Internal Server Error");
  }
};

export const useActivitiesCountComponentsData = () => {
  const { data, error, mutate } = useSWR(
    "/api/activities/count-components",
    fetchCountComponentsActivities,
    {
      revalidateOnFocus: false, // Prevent re-fetching on tab focus
      revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
      refreshInterval: 0, // Disable polling
      dedupingInterval: 60 * 1000, // Cache the data for 1 minute
    }
  );

  return {
    activitiesCountComponentData: data,
    activitiesCountComponentLoading: !error && !data,
    activitiesCountComponentError: error,
    refetchActivitiesCount: mutate, // Manually refetch when needed
  };
};
