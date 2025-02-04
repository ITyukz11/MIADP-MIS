// import useSWR from "swr";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export const useCountActivitiesData = () => {
//   const { data, error, mutate } = useSWR(
//     "/api/activities/count-activities",
//     fetcher,
//     {
//       revalidateOnFocus: false, // Prevent re-fetching on tab focus
//       revalidateOnReconnect: false, // Prevent re-fetching on network reconnection
//       refreshInterval: 0, // Disable polling
//       dedupingInterval: 60 * 1000,
//     }
//   );

//   return {
//     countActivitiesData: data,
//     countActivityLoading: !error && !data,
//     countActivityError: error,
//     refreshCountActivity: mutate,
//   };
// };

// //THIS IS SWR BUT ITS TOO EXPENSIVE IN VERCEL COST
