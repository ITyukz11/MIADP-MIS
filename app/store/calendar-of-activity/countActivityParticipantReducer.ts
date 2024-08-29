import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserWithActivityCount } from '@/types/calendar-of-activity/calendar-of-activity';
import { fetchCountActivityParticipantsData } from './countActivityParticipantAction';

interface ParticipantCountActivityState {
  countParticipantActivitiesData: UserWithActivityCount[];
  countParticipantActivityLoading: boolean;
  countParticipantActivityError: string | null;
}

const initialState: ParticipantCountActivityState = {
  countParticipantActivitiesData: [], // Initialize as an empty array
  countParticipantActivityLoading: false,
  countParticipantActivityError: null,
};

const countParticipantActivitySlice = createSlice({
  name: 'countParticipantActivity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountActivityParticipantsData.pending, (state) => {
        state.countParticipantActivityLoading = true;
        state.countParticipantActivityError = null;
      })
      .addCase(fetchCountActivityParticipantsData.fulfilled, (state, action: PayloadAction<UserWithActivityCount[]>) => {
        state.countParticipantActivitiesData = action.payload; // Set the array of users
        state.countParticipantActivityLoading = false;
      })
      .addCase(fetchCountActivityParticipantsData.rejected, (state, action) => {
        state.countParticipantActivityLoading = false;
        state.countParticipantActivityError = action.error.message || 'Failed to load count participants activities';
      });
  },
});

export default countParticipantActivitySlice.reducer;
