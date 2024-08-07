import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useActivitiesData = () => {
  const { data, error } = useSWR('/api/activities/count-activities', fetcher, {
  });

  return {
    countActivitiesData: data,
    countActivityLoading: !error && !data,
    countActivityError: error,
  };
};

//THIS IS SWR BUT ITS TOO EXPENSIVE IN VERCEL COST 