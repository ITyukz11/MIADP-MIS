import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCalendarOfActivity } from '@/lib/calendar-of-activity/fetch-calendar-of-activity';
import { Activity } from '@/types/calendar-of-activity/calendar-of-activity';

export const fetchActivitiesData = createAsyncThunk<Activity[]>(
  'activities/fetchActivitiesData',
  async () => {
    const response = await fetchCalendarOfActivity();

    // Store the current date in localStorage after fetching the data
    const currentDate = new Date().toISOString(); // ISO string format (e.g., '2024-10-21T12:34:56.789Z')
    localStorage.setItem('fetchActivitiesDataDate', currentDate);

    return response;
  }
);
