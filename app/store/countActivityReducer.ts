'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountActivity } from '@/types/calendar-of-activity/calendar-of-activity';
import { fetchCountActivitiesData } from './countActivityAction';

interface CountActivityState {
  countActivitiesData: CountActivity;
  countActivityLoading: boolean;
  countActivityError: string | null;
}

const initialState: CountActivityState = {
    countActivitiesData: {},
    countActivityLoading: false,
    countActivityError: null,
};

const countActivitySlice = createSlice({
  name: 'countActivity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountActivitiesData.pending, (state) => {
        state.countActivityLoading = true;
        state.countActivityError = null;
      })
      .addCase(fetchCountActivitiesData.fulfilled, (state, action: PayloadAction<CountActivity>) => {
        state.countActivitiesData = action.payload;
        state.countActivityLoading = false;
      })
      .addCase(fetchCountActivitiesData.rejected, (state) => {
        state.countActivityLoading = false;
        state.countActivityError = 'Failed to load activities';
      });
  },
  
});

export default countActivitySlice.reducer;


