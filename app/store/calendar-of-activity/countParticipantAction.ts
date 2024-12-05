import { CountActivitiesParticipants, UserWithActivityCount } from '@/types/calendar-of-activity/calendar-of-activity';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCountCalendarActivityParticipantsData = createAsyncThunk<CountActivitiesParticipants[]>(
  'activities/count-participants',
  async () => {
    const response = await fetch('/api/activities/count-participants'); // Adjust the URL to your API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return (await response.json()) as CountActivitiesParticipants[]; // Correctly typed as an array
  }
);
