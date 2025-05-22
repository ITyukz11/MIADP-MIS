import { ProcessDocReportType } from "@/app/(app)/component-1/components/forms/ProcessDocumentReportForm";
import useSWR from "swr";

const fetchProcessDocReport = async (): Promise<ProcessDocReportType[]> => {
  try {
    const response = await fetch("/api/auth/ad-plan/process-doc-report", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();
    return data.reports; // must be an array of valid ProcessDocReportType
  } catch (error) {
    console.error("Error fetching process doc report:", error);
    throw error;
  }
};

export const useADPlanProcessDocReportData = () => {
  const { data, error, mutate } = useSWR<ProcessDocReportType[]>(
    "/api/auth/ad-plan/process-doc-report",
    fetchProcessDocReport,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    adPlanProcDocReportData: data,
    adPlanProcDocReportLoading: !error && !data,
    adPlanProcDocReportError: error,
    refetchAdPlanProcDocReport: mutate,
  };
};
