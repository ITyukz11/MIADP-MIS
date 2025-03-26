"use client";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import {
  ConstructionIcon,
  LucideNotepadText,
  RefreshCcw,
  TargetIcon,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaPlusCircle, FaStore } from "react-icons/fa";

import { IoMdHelpCircle } from "react-icons/io";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import MultiSelectFilterRegion from "../components/MultiSelectFilterRegion";
import MultiSelectFilterCommodities from "../components/MultiSelectFilterCommodities";
import MultiSelectFilterInfraEntrep from "../components/MultiSelectFilterInfraEntrep";
import MultiSelectFilterValidated from "../components/MultiSelectFilterValidated";
import MultiSelectFilterConceptNote from "../components/MultiSelectFilterCN";
import { countConceptNoteTrue } from "../components/counts/countConceptNotes";
import { useAdPlanTable8Counts } from "../components/counts/countInfraAndEntrep";
import { countValidatedTrue } from "../components/counts/countValidated";
import { GiNotebook } from "react-icons/gi";
import { GrValidate } from "react-icons/gr";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivitiesLayoutProps {
  children: React.ReactNode;
}

export default function Table8Layout({ children }: ActivitiesLayoutProps) {
  const { adPlanTable8Data, adPlanTable8Loading, refetchAdPlanTable8 } =
    useADPlanTable8Data();

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
  const { infraCount, entrepCount } = useAdPlanTable8Counts(adPlanTable8Data);
  const conceptNoteTrueCount = countConceptNoteTrue(adPlanTable8Data);
  const validatedTrueCount = countValidatedTrue(adPlanTable8Data);

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              # of Infrastructure
            </CardTitle>
            <ConstructionIcon className="text-muted-foreground w-5 h-5" />
          </CardHeader>
          <CardContent>
            {infraCount == 0 ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-5" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{infraCount}</div>
                <p className="text-xs text-muted-foreground">
                  + data still not accurate ok?
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              # of Enterprise
            </CardTitle>
            <FaStore className="text-muted-foreground w-5 h-5" />
          </CardHeader>
          <CardContent>
            {entrepCount == 0 ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-5" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{entrepCount}</div>
                <p className="text-xs text-muted-foreground">
                  + data still not accurate ok?
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              # of SP Validated
            </CardTitle>
            <GrValidate className="text-muted-foreground w-5 h-5" />
          </CardHeader>
          <CardContent>
            {adPlanTable8Loading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-5" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{validatedTrueCount}</div>
                <p className="text-xs text-muted-foreground">
                  + data still not accurate ok?
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              # of SP with CN
            </CardTitle>
            <GiNotebook className="text-muted-foreground w-5 h-5" />
          </CardHeader>
          <CardContent>
            {conceptNoteTrueCount == 0 ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-5" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{conceptNoteTrueCount}</div>
                <p className="text-xs text-muted-foreground">
                  + data still not accurate ok?
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card className="flex flex-row gap-2 w-full shadow-none">
          <CardContent className="flex items-center justify-center md:justify-start gap-2 w-full p-4 flex-wrap">
            <Button
              className="flex flex-row mt-auto"
              disabled={adPlanTable8Loading}
            >
              <FaPlus />
              Add New Subproject
            </Button>
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
