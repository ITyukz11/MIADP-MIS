// src/app/store/userReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsersData } from "./userAction";
import { UserType } from "@/types/users/userType";

interface UserState {
  usersData: UserType[];
  loadingUser: boolean;
  errorUser: string | null;
}

const initialState: UserState = {
  usersData: [],
  loadingUser: false,
  errorUser: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersData.pending, (state) => {
        state.loadingUser = true;
        state.errorUser = null;
      })
      .addCase(
        fetchUsersData.fulfilled,
        (state, action: PayloadAction<UserType[]>) => {
          state.usersData = action.payload;
          state.loadingUser = false;
        }
      )
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.loadingUser = false;
        state.errorUser = action.error.message || "Failed to load users";
      });
  },
});

export default userSlice.reducer;
