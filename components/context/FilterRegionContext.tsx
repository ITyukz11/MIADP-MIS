'use client'
import React, { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';

export interface CalendarOfActivityFilter {
  filter: string;
  typeOfActivity: string;
  unit: string;
  // Add other filter properties if needed
}

// Define the shape of the context value
interface CalendarOfActivityFilterValue {
  currentFilter: CalendarOfActivityFilter | null;
  setCurrentFilter: (filter: CalendarOfActivityFilter | null) => void;
}

// Create the context with a default value
const CalendarOfActivityFilterContext = createContext<CalendarOfActivityFilterValue | undefined>(undefined);

// Create a Provider component
interface CalendarOfActivityFilterProviderProps {
  children: ReactNode;
  initialFilter: CalendarOfActivityFilter;
}

export const CalendarOfActivityFilterProvider: FC<CalendarOfActivityFilterProviderProps> = ({ children, initialFilter }) => {
  const [currentFilter, setCurrentFilterState] = useState<CalendarOfActivityFilter | null>(() => {
    const storedFilter = localStorage.getItem('calendarOfActivityFilter');
    return storedFilter ? JSON.parse(storedFilter) : initialFilter;
  });

  useEffect(() => {
    if (currentFilter) {
      localStorage.setItem('calendarOfActivityFilter', JSON.stringify(currentFilter));
    } else {
      localStorage.removeItem('calendarOfActivityFilter');
    }
  }, [currentFilter]);

  const setCurrentFilter = (filter: CalendarOfActivityFilter | null) => {
    setCurrentFilterState(filter);
  };

  return (
    <CalendarOfActivityFilterContext.Provider value={{ currentFilter, setCurrentFilter }}>
      {children}
    </CalendarOfActivityFilterContext.Provider>
  );
};


export const useCalendarOfActivityFilter = (): CalendarOfActivityFilterValue => {
  const context = useContext(CalendarOfActivityFilterContext);
  if (!context) {
    throw new Error('useCalendarOfActivityFilter must be used within a CalendarOfActivityFilterProvider');
  }
  return context;
};
