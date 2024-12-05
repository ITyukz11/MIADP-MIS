'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubProjectCodeType } from '@/types/subproject/subproject-type';
import { fetchSubprojectData } from './subprojectAction';

interface SubprojectState {
  subprojectData: SubProjectCodeType[];
  subprojectLoading: boolean;
  subprojectError: string | null;
}

const initialState: SubprojectState = {
  subprojectData: [],
  subprojectLoading: false,
  subprojectError: null,
};

const subprojectDataSlice = createSlice({
  name: 'subprojectData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubprojectData.pending, (state) => {
        state.subprojectLoading = true;
        state.subprojectError = null;
      })
      .addCase(fetchSubprojectData.fulfilled, (state, action: PayloadAction<SubProjectCodeType[]>) => {
        state.subprojectData = action.payload; // Set the array of users
        state.subprojectLoading = false;
      })
      .addCase(fetchSubprojectData.rejected, (state) => {
        state.subprojectLoading = false;
        state.subprojectError = 'Failed to load subproject data';
      });
  },
  
});

export default subprojectDataSlice.reducer;


