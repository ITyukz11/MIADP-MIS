import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountActivitiesParticipants } from '@/types/calendar-of-activity/calendar-of-activity';
import { fetchCountCalendarActivityParticipantsData } from './countParticipantAction';

interface ParticipantCountState {
  countParticipantActivitiesData: CountActivitiesParticipants[];
  countParticipantActivityLoading: boolean;
  countParticipantActivityError: string | null;
}

const initialState: ParticipantCountState = {
  countParticipantActivitiesData: [], // Initialize as an empty array
  countParticipantActivityLoading: false,
  countParticipantActivityError: null,
};

const countParticipantActivitySlice = createSlice({
  name: 'countParticipantActivities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountCalendarActivityParticipantsData.pending, (state) => {
        state.countParticipantActivityLoading = true;
        state.countParticipantActivityError = null;
      })
      .addCase(fetchCountCalendarActivityParticipantsData.fulfilled, (state, action: PayloadAction<CountActivitiesParticipants[]>) => {
        state.countParticipantActivitiesData = action.payload; // Set the array of users
        state.countParticipantActivityLoading = false;
      })
      .addCase(fetchCountCalendarActivityParticipantsData.rejected, (state, action) => {
        state.countParticipantActivityLoading = false;
        state.countParticipantActivityError = action.error.message || 'Failed to load count participants activities';
      });
  },
});

export default countParticipantActivitySlice.reducer;
