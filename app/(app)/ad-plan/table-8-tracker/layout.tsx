"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import MultiSelectFilterRegion from "../components/MultiSelectFilterRegion";
import MultiSelectFilterCommodities from "../components/MultiSelectFilterCommodities";
import MultiSelectFilterInfraEntrep from "../components/MultiSelectFilterInfraEntrep";
import MultiSelectFilterValidated from "../components/MultiSelectFilterValidated";
import MultiSelectFilterConceptNote from "../components/MultiSelectFilterCN";

interface ActivitiesLayoutProps {
  children: React.ReactNode;
}

export default function Table8Layout({ children }: ActivitiesLayoutProps) {
  const { adPlanTable8Loading, refetchAdPlanTable8 } = useADPlanTable8Data();

  const [isRefreshing, setIsRefreshing] = useState(false); // Local loading state

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
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              AD PLAN Table 8 Tracker{" "}
            </h2>
          </div>
          <Label className="text-xs sm:text-sm text-muted-foreground">
            BETA VERSION
          </Label>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card className="flex flex-row gap-2 w-full shadow-none">
          <CardContent className="flex items-center justify-center md:justify-start gap-2 w-full p-4 flex-wrap">
            {/* <Button
              className="flex flex-row mt-auto"
              disabled={adPlanTable8Loading}
            >
              <FaPlus />
              Add New Subproject
            </Button> */}
            <MultiSelectFilterRegion />
            <MultiSelectFilterInfraEntrep />
            <MultiSelectFilterCommodities />
            <MultiSelectFilterValidated />
            <MultiSelectFilterConceptNote />

            <div className="flex flex-row gap-2 md:ml-auto">
              <Button
                onClick={handleRefresh}
                disabled={adPlanTable8Loading || isRefreshing}
              >
                {isRefreshing ? (
                  <span className="flex items-center">
                    <span className="spinner mr-2"></span> Huulat lang...
                  </span>
                ) : (
                  <>
                    Fetch Data <RefreshCcw />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
