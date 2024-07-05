// src/app/components/ReduxProvider.tsx
"use client"; // Mark this file as a client component

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/app/store/store';

const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
