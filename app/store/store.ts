// src/app/store/store.ts
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import activityReducer from './activityReducer';
import userReducer from './userReducer';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedActivityReducer = persistReducer(persistConfig, activityReducer);
const persistedCountActivityReducer = persistReducer(persistConfig, countActivityReducer);
const persistedCountByComponentActivityReducer = persistReducer(persistConfig, countComponentActivityReducer);
  
const store = configureStore({
  reducer: {
    activity: persistedActivityReducer,
    users: userReducer,
    countActivity: persistedCountActivityReducer,
    countByComponentActivity: persistedCountByComponentActivityReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch as useDispatchBase, useSelector as useSelectorBase } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import countActivityReducer from './countActivityReducer';
import countComponentActivityReducer from './countComponentActivityReducer';

export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export default store;
