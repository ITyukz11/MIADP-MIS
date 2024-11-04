'use client'
import React, { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';

// Define the shape of the user
export interface User {
  name?: string;
  email?: string;
  role?: string;
  region?: string;
  position?: string;
  expoPushToken?: string;
  component?: string;
  unit?: string;
  id?: string;
  color?: string;
  verificationQuestion?: String
  verificationAnswer?: String
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
  // Initialize state from localStorage or use initialUser
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : initialUser;
  });

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Create a setter function that also updates localStorage
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
  };

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
