// src/app/store/userActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllUsers } from '@/lib/admin/users';
import { User } from '@/types/users/userType';

export const fetchUsersData = createAsyncThunk<User[]>(
  'users/fetchUsersData',
  async () => {
    const response = await fetchAllUsers();
    return response;
  }
);
