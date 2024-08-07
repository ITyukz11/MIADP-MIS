import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CountComponentActivity } from '@/types/calendar-of-activity/calendar-of-activity';
import { fetchComponentCountsData } from './countComponentActivityAction';

interface ComponentCountsState {
  componentActivityCountsData: CountComponentActivity;
  componentActivityCountsLoading: boolean;
  componentActivityCountsError: string | null;
}

const initialState: ComponentCountsState = {
  componentActivityCountsData: {},
  componentActivityCountsLoading: false,
  componentActivityCountsError: null,
};

const componentActivityCountsSlice = createSlice({
  name: 'componentActivityCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComponentCountsData.pending, (state) => {
        state.componentActivityCountsLoading = true;
        state.componentActivityCountsError = null;
      })
      .addCase(fetchComponentCountsData.fulfilled, (state, action: PayloadAction<CountComponentActivity>) => {
        state.componentActivityCountsData = action.payload;
        state.componentActivityCountsLoading = false;
      })
      .addCase(fetchComponentCountsData.rejected, (state, action) => {
        state.componentActivityCountsLoading = false;
        state.componentActivityCountsError = action.error.message || 'Failed to load component counts';
      });
  },
});

export default componentActivityCountsSlice.reducer;
