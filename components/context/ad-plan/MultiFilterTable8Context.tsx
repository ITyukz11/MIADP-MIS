"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  FC,
  useEffect,
} from "react";

export interface ADPlanTable8MultiFilter {
  region: string[];
  commodities: string[];
  infraEntrep: string[];
  typeOfSP: string[];
  validated: string[];
  conceptNote: string[];
}

// Define the shape of the context value
interface ADPlanTable8FilterValue {
  currentMultiFilter: ADPlanTable8MultiFilter;
  setCurrentMultiFilter: (filter: ADPlanTable8MultiFilter) => void;
  resetFilters: () => void;
}

// Create the context
const ADPlanTable8MultiFilterContext = createContext<
  ADPlanTable8FilterValue | undefined
>(undefined);

// Provider component
interface ADPlanTable8FilterProviderProps {
  children: ReactNode;
  initialMultiFilter: ADPlanTable8MultiFilter;
}

export const ADPlanTable8MultiFilterProvider: FC<
  ADPlanTable8FilterProviderProps
> = ({ children, initialMultiFilter }) => {
  const [currentMultiFilter, setCurrentMultiFilterState] =
    useState<ADPlanTable8MultiFilter>(() => {
      const storedFilter = localStorage.getItem("ADPlanTable8MultiFilter");

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
      "ADPlanTable8MultiFilter",
      JSON.stringify(currentMultiFilter)
    );
  }, [currentMultiFilter]);

  // Function to update filters
  const setCurrentMultiFilter = (filter: ADPlanTable8MultiFilter) => {
    setCurrentMultiFilterState(filter);
  };

  // Function to reset all filters to "All"
  const resetFilters = () => {
    setCurrentMultiFilterState({
      region: ["All"],
      //   lgu: ["All"],
      commodities: ["All"],
      infraEntrep: ["All"],
      typeOfSP: ["All"],
      //   location: ["All"],
      validated: ["All"],
      conceptNote: ["All"],
    });
  };

  return (
    <ADPlanTable8MultiFilterContext.Provider
      value={{ currentMultiFilter, setCurrentMultiFilter, resetFilters }}
    >
      {children}
    </ADPlanTable8MultiFilterContext.Provider>
  );
};

// Hook to use the filter context
export const useADPlanTable8MultiFilter = (): ADPlanTable8FilterValue => {
  const context = useContext(ADPlanTable8MultiFilterContext);
  if (!context) {
    throw new Error(
      "useADPlanTable8MultiFilter must be used within a CalendarOfActivityFilterProviderTest"
    );
  }
  return context;
};
