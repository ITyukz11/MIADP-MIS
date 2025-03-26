"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  FC,
  useEffect,
} from "react";

export interface CalendarOfActivityMultiFilter {
  region: string[];
  type: string[];
  typeOfActivity: string[];
  unit: string[];
  status: string[];
  month: string[];
  wfpYear: string[];
}

// Define the shape of the context value
interface CalendarOfActivityFilterValue {
  currentMultiFilter: CalendarOfActivityMultiFilter;
  setCurrentMultiFilter: (filter: CalendarOfActivityMultiFilter) => void;
  resetFilters: () => void;
}

// Create the context
const CalendarOfActivityMultiFilterContext = createContext<
  CalendarOfActivityFilterValue | undefined
>(undefined);

// Provider component
interface CalendarOfActivityFilterProviderProps {
  children: ReactNode;
  initialMultiFilter: CalendarOfActivityMultiFilter;
}

export const CalendarOfActivityMultiFilterProvider: FC<
  CalendarOfActivityFilterProviderProps
> = ({ children, initialMultiFilter }) => {
  const [currentMultiFilter, setCurrentMultiFilterState] =
    useState<CalendarOfActivityMultiFilter>(() => {
      const storedFilter = localStorage.getItem(
        "calendarOfActivityMultiFilter"
      );

      try {
        return storedFilter ? JSON.parse(storedFilter) : initialMultiFilter;
      } catch (error) {
        console.error("Error parsing filter from localStorage:", error);
        return initialMultiFilter; // Fallback to default if parsing fails
      }
    });

  // Sync to localStorage on filter change
  useEffect(() => {
    localStorage.setItem(
      "calendarOfActivityMultiFilter",
      JSON.stringify(currentMultiFilter)
    );
  }, [currentMultiFilter]);

  // Function to update filters
  const setCurrentMultiFilter = (filter: CalendarOfActivityMultiFilter) => {
    setCurrentMultiFilterState(filter);
  };

  // Function to reset all filters to "All"
  const resetFilters = () => {
    setCurrentMultiFilterState({
      region: ["All"],
      type: ["All"],
      typeOfActivity: ["All"],
      unit: ["All"],
      status: ["All"],
      month: ["All"],
      wfpYear: ["All"],
    });
  };

  return (
    <CalendarOfActivityMultiFilterContext.Provider
      value={{ currentMultiFilter, setCurrentMultiFilter, resetFilters }}
    >
      {children}
    </CalendarOfActivityMultiFilterContext.Provider>
  );
};

// Hook to use the filter context
export const useCalendarOfActivityMultiFilter =
  (): CalendarOfActivityFilterValue => {
    const context = useContext(CalendarOfActivityMultiFilterContext);
    if (!context) {
      throw new Error(
        "useCalendarOfActivityMultiFilter must be used within a CalendarOfActivityFilterProviderTest"
      );
    }
    return context;
  };
