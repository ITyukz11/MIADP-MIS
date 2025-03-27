"use client";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import MultiSelectFilterRegion from "../components/MultiSelectFilterRegion";
import MultiSelectFilterCommodities from "../components/MultiSelectFilterCommodities";
import MultiSelectFilterInfraEntrep from "../components/MultiSelectFilterInfraEntrep";
import MultiSelectFilterValidated from "../components/MultiSelectFilterValidated";
import MultiSelectFilterConceptNote from "../components/MultiSelectFilterCN";
import Link from "next/link";
import { FaFilter } from "react-icons/fa";
import { useADPlanTable8MultiFilter } from "@/components/context/ad-plan/MultiFilterTable8Context";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ActivitiesLayoutProps {
  children: React.ReactNode;
}

export default function Table8Layout({ children }: ActivitiesLayoutProps) {
  const { adPlanTable8Loading, refetchAdPlanTable8 } = useADPlanTable8Data();

  const [isRefreshing, setIsRefreshing] = useState(false); // Local loading state
  const [isOpen, setIsOpen] = useState(false);
  const { currentMultiFilter } = useADPlanTable8MultiFilter();

  // Count how many filters are applied
  const appliedFiltersCount = useMemo(() => {
    return Object.values(currentMultiFilter).reduce((count, value) => {
      if (Array.isArray(value)) {
        const filteredValues = value.filter((v) => v !== "All"); // Exclude "All"
        return count + filteredValues.length;
      }
      return count;
    }, 0);
  }, [currentMultiFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true); // Start loading
    try {
      await refetchAdPlanTable8(); // Wait for data to refetch
    } catch (error) {
      console.error("Error refreshing activities:", error);
    } finally {
      setIsRefreshing(false); // End loading
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-row flex-wrap gap-2 justify-between">
        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <div className="flex flex-row gap-2 flex-wrap items-center">
            <Label className="text-xl md:text-3xl font-bold tracking-tight">
              AD PLAN Table 8 Tracker{" "}
            </Label>
            <Label className="text-xs sm:text-sm text-muted-foreground">
              BETA VERSION
            </Label>
          </div>

          <div className="flex flex-row flex-wrap gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex items-center gap-2"
                >
                  <FaFilter size={18} />
                  <span>Filters</span>

                  {/* Badge for applied filters count */}
                  {appliedFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {appliedFiltersCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>

              {/* Popover Content Styled for Right Alignment & Mobile Layout */}
              <PopoverContent
                className="border-gray-300 p-4 w-[350px] md:w-fit shadow-lg"
                align="end" // Moves it to the right
              >
                <div className="flex flex-row flex-wrap gap-4">
                  <MultiSelectFilterRegion />
                  <MultiSelectFilterInfraEntrep />
                  <MultiSelectFilterCommodities />
                  <MultiSelectFilterValidated />
                  <MultiSelectFilterConceptNote />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
