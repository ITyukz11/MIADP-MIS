"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  FC,
  useEffect,
} from "react";

// Define the shape of the multi-filter state
export interface ProcessDocReportMultiFilter {
  region: string[];
  province: string[];
  city: string[];
  municipality: string[];
  baranggay: string[];
  WFPActivity: string[];
  month: string[]; // Updated to month for filtering
  year: string[]; // Added year for filtering
  preActivity: string[];
  during: string[];
  postActivity: string[];
  noOfParticipants: string[];
}

// Define the context value
interface ProcessDocReportFilterValue {
  currentMultiFilter: ProcessDocReportMultiFilter;
  setCurrentMultiFilter: (filter: ProcessDocReportMultiFilter) => void;
  resetFilters: () => void;
}

// Create the context
const ProcessDocReportFilterContext = createContext<
  ProcessDocReportFilterValue | undefined
>(undefined);

// Provider props
interface ProcessDocReportFilterProviderProps {
  children: ReactNode;
  initialMultiFilter: ProcessDocReportMultiFilter;
}

// Provider implementation
export const ProcessDocReportFilterProvider: FC<
  ProcessDocReportFilterProviderProps
> = ({ children, initialMultiFilter }) => {
  const [currentMultiFilter, setCurrentMultiFilterState] =
    useState<ProcessDocReportMultiFilter>(() => {
      const stored = localStorage.getItem("ProcessDocReportMultiFilter");
      try {
        return stored ? JSON.parse(stored) : initialMultiFilter;
      } catch (error) {
        console.error("Failed to parse stored filters:", error);
        return initialMultiFilter;
      }
    });

  useEffect(() => {
    localStorage.setItem(
      "ProcessDocReportMultiFilter",
      JSON.stringify(currentMultiFilter)
    );
  }, [currentMultiFilter]);

  const setCurrentMultiFilter = (filter: ProcessDocReportMultiFilter) => {
    setCurrentMultiFilterState(filter);
  };

  const resetFilters = () => {
    setCurrentMultiFilterState({
      region: ["All"],
      province: ["All"],
      city: ["All"],
      municipality: ["All"],
      baranggay: ["All"],
      WFPActivity: ["All"],
      month: ["All"], // Updated to month
      year: ["All"], // Added year
      preActivity: ["All"],
      during: ["All"],
      postActivity: ["All"],
      noOfParticipants:["All"]
    });
  };

  return (
    <ProcessDocReportFilterContext.Provider
      value={{ currentMultiFilter, setCurrentMultiFilter, resetFilters }}
    >
      {children}
    </ProcessDocReportFilterContext.Provider>
  );
};

// Hook for using the filter context
export const useProcessDocReportMultiFilter = (): ProcessDocReportFilterValue => {
  const context = useContext(ProcessDocReportFilterContext);
  if (!context) {
    throw new Error(
      "useProcessDocReportMultiFilter must be used within a ProcessDocReportFilterProvider"
    );
  }
  return context;
};
