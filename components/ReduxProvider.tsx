// src/app/components/ReduxProvider.tsx
"use client"; // Mark this file as a client component

import { Provider } from 'react-redux';
import store from '@/app/store/store';

const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
