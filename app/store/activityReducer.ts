'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchActivitiesData } from './activityAction';
import { Activity } from '@/types/calendar-of-activity/calendar-of-activity';

interface ActivityState {
  activitiesData: Activity[];
  activityLoading: boolean;
  activityError: string | null;
}

const initialState: ActivityState = {
  activitiesData: [],
  activityLoading: false,
  activityError: null,
};

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivitiesData.pending, (state) => {
        state.activityLoading = true;
        state.activityError = null;
      })
      .addCase(fetchActivitiesData.fulfilled, (state, action: PayloadAction<Activity[]>) => {
        state.activitiesData = action.payload;
        state.activityLoading = false;
      })
      .addCase(fetchActivitiesData.rejected, (state) => {
        state.activityLoading = false;
        state.activityError = 'Failed to load activities';
      });
  },
});

export default activitySlice.reducer;
