import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  console.log("useActivitiesData");
  const { data, error } = useSWR(
    "/api/auth/calendar-of-activity",
    fetchAllActivities,
    {
      refreshInterval: 5000,
    }
  );

  return {
    activitiesData: data,
    activityLoading: !error && !data,
    activityError: error,
  };
};

//THIS IS SWR BUT ITS TOO EXPENSIVE IN VERCEL COST
