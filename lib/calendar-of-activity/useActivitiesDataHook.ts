import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useActivitiesData = () => {
  const { data, error } = useSWR('/api/auth/calendar-of-activity', fetcher, {
  });

  return {
    activitiesData: data,
    activityLoading: !error && !data,
    activityError: error,
  };
};

//THIS IS SWR BUT ITS TOO EXPENSIVE IN VERCEL COST 