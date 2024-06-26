// 'use client'
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { fetchCalendarOfActivity } from '@/lib/calendar-of-activity/fetch-calendar-of-activity';
// import { Activity } from '@/types/calendar-of-activity';

// interface ActivityContextProps {
//   activities: Activity[];
//   loading: boolean;
//   error: string | null;
//   fetchActivitiesData: () => Promise<void>;
// }

// const CalendarOfActivityContext = createContext<ActivityContextProps | undefined>(undefined);

// export const CalendarOfActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchActivitiesData = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchCalendarOfActivity();
//       setActivities(data);
//     } catch (error) {
//       setError('Failed to load activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivitiesData();
//   }, []);

//   return (
//     <CalendarOfActivityContext.Provider value={{ activities, loading, error, fetchActivitiesData }}>
//       {children}
//     </CalendarOfActivityContext.Provider>
//   );
// };

// export const useCalendarOfActivityContext = () => {
//   const context = useContext(CalendarOfActivityContext);
//   if (!context) {
//     throw new Error('useActivityContext must be used within an ActivityProvider');
//   }
//   return context;
// };
