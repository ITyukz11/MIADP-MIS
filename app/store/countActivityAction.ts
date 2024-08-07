import { createAsyncThunk } from '@reduxjs/toolkit';
import { CountActivity } from '@/types/calendar-of-activity/calendar-of-activity';

export const fetchCountActivitiesData = createAsyncThunk<CountActivity>(
  'activities/fetchCountActivitiesData',
  async () => {
    const response = await fetch('/api/activities/count-activities'); // Adjust the URL to your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return (await response.json()) as CountActivity;
  }
);
