// src/app/store/userActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllUsers } from "@/lib/admin/users";
import { UserType } from "@/types/users/userType";

export const fetchUsersData = createAsyncThunk<UserType[]>(
  "users/fetchUsersData",
  async () => {
    const response = await fetchAllUsers();
    return response;
  }
);
