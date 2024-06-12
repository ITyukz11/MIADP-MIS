'use client'
// CurrentUserContext.tsx
import React, { createContext, useState, useContext, ReactNode, FC } from 'react';

// Define the shape of the user
interface User {
  name: string;
  role: string;
  region: string;
  expoPushToken: string;
  component:string;
  unit:string;
  id:string;
  // Add other user properties if needed
}

// Define the shape of the context value
interface CurrentUserContextValue {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

// Create the context with a default value
const CurrentUserContext = createContext<CurrentUserContextValue | undefined>(undefined);

// Create a Provider component
interface CurrentUserProviderProps {
  children: ReactNode;
  initialUser: User;
}

export const CurrentUserProvider: FC<CurrentUserProviderProps> = ({ children, initialUser }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

// Create a custom hook to use the CurrentUserContext
export const useCurrentUser = (): CurrentUserContextValue => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};
