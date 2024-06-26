'use client'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCalendarOfActivity } from '@/lib/calendar-of-activity/fetch-calendar-of-activity';
import { Activity } from '@/types/calendar-of-activity/calendar-of-activity';

export const fetchActivitiesData = createAsyncThunk<Activity[]>(
  'activities/fetchActivitiesData',
  async () => {
    const response = await fetchCalendarOfActivity();
    return response;
  }
);
