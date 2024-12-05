import { createAsyncThunk } from '@reduxjs/toolkit';
import { SubProjectCodeType } from '@/types/subproject/subproject-type';

const AUTH_USERNAME = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME!;
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD!;

export const fetchSubprojectData = createAsyncThunk<SubProjectCodeType[]>(
  'activities/fetchSubprojectData',
  async () => {
    const response = await fetch('/api/subproject', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subproject data');
    }

    return (await response.json()) as SubProjectCodeType[];
  }
);
