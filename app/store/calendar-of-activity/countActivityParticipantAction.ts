import { UserWithActivityCount } from '@/types/calendar-of-activity/calendar-of-activity';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCountActivityParticipantsData = createAsyncThunk<UserWithActivityCount[]>(
  'activities/fetchCountActivityParticipantsData',
  async () => {
    const response = await fetch('/api/auth/user/activity-participant'); // Adjust the URL to your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return (await response.json()) as UserWithActivityCount[]; // Correctly typed as an array
  }
);
