// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import activityReducer from './activityReducer';
import userReducer from './userReducer';
import { TypedUseSelectorHook, useDispatch as useDispatchBase, useSelector as useSelectorBase } from 'react-redux';

const store = configureStore({
  reducer: {
    activity: activityReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks to use the typed dispatch and selector

export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export default store;
