// src/app/store/store.ts
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import activityReducer from './activityReducer';
import userReducer from './userReducer';

const persistConfig = {
  key: 'root',
  storage,
};

//CALENDAR OF ACTIVITY
const persistedActivityReducer = persistReducer(persistConfig, activityReducer);
const persistedCountActivityReducer = persistReducer(persistConfig, countActivityReducer);
const persistedCountByComponentActivityReducer = persistReducer(persistConfig, countComponentActivityReducer);
const persistedCountActivityParticipantReducer = persistReducer(persistConfig, countActivityParticipantReducer);
const persistedCountParticipantActivitiesReducer = persistReducer(persistConfig, countParticipantReducer);

//DOCUMENT TRACKING
const persistedCorrespondenceDocumentReducer = persistReducer(persistConfig, documentReducer);
const persistedCorrespondenceDocumentIncomingRouteReducer = persistReducer(persistConfig, incomingRouteReducer);

//SUBPROJECT
const persistedSubprojectReducer = persistReducer(persistConfig, subprojectReducer);

const store = configureStore({
  reducer: {
    activity: persistedActivityReducer,
    users: userReducer,
    countActivity: persistedCountActivityReducer,
    countByComponentActivity: persistedCountByComponentActivityReducer,
    countActivityParticipant: persistedCountActivityParticipantReducer,
    countParticipantActivites: persistedCountParticipantActivitiesReducer,
    correspondenceDocument: persistedCorrespondenceDocumentReducer,
    correspondenceIncomingRoute: persistedCorrespondenceDocumentIncomingRouteReducer,

    subprojectData:persistedSubprojectReducer
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
import documentReducer from './document-tracking/correspondence/documentReducer';
import incomingRouteReducer from './document-tracking/correspondence/incomingRouteReducer';
import countActivityParticipantReducer from './calendar-of-activity/countActivityParticipantReducer';
import countParticipantReducer from './calendar-of-activity/countParticipantReducer'
import subprojectReducer from './subproject/subprojectReducer';

export const useDispatch = () => useDispatchBase<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export default store;
