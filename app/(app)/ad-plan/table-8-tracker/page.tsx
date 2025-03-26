"use client";
import { useADPlanTable8MultiFilter } from "@/components/context/ad-plan/MultiFilterTable8Context";
import { DataTable } from "@/components/table/data-table";
import { AdPlanTable8Column } from "@/components/table/data/ad-plan/columns";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useADPlanTable8Data } from "@/lib/ad-plan/table8/useTable8DataHook";
import React, { useEffect, useMemo, useState } from "react";

type Props = {};

const Page = ({}: Props) => {
  const { adPlanTable8Data, adPlanTable8Error, adPlanTable8Loading } =
    useADPlanTable8Data();
  const { currentMultiFilter } = useADPlanTable8MultiFilter();
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Consolidated Filtering Logic
  const filterTable8 = useMemo(() => {
    return (data: any[]) => {
      return data.filter((table8) => {
        const matchesRegion =
          currentMultiFilter?.region?.includes("All") ||
          currentMultiFilter?.region?.includes(table8.region);

        const matchesCommodities =
          currentMultiFilter?.commodities?.includes("All") ||
          currentMultiFilter?.commodities?.some((commodity) =>
            table8.commodities.toLowerCase().includes(commodity.toLowerCase())
          );

        const matchesInfraEntrep =
          currentMultiFilter?.infraEntrep?.includes("All") ||
          currentMultiFilter?.infraEntrep?.includes(table8.infraEntrep);

        const matchesValidated =
          currentMultiFilter?.validated?.includes("All") || // Show all if "All" is selected
          currentMultiFilter?.validated?.some(
            (val) => val === table8.validated.toString() // Convert boolean to string for comparison
          );

        const matchesConcepNote =
          currentMultiFilter?.conceptNote?.includes("All") || // Show all if "All" is selected
          currentMultiFilter?.conceptNote?.some(
            (val) => val === table8.conceptNote.toString() // Convert boolean to string for comparison
          );

        return (
          // matchesType &&
          // matchesActivityType &&
          matchesRegion &&
          matchesCommodities &&
          matchesInfraEntrep &&
          matchesValidated &&
          matchesConcepNote
          // matchesUnit &&
          // matchesStatus &&
          // matchesWFPYear &&
          // matchesMonth
        );
      });
    };
  }, [currentMultiFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFilteredData(filterTable8(adPlanTable8Data));
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };

    fetchData();
  }, [adPlanTable8Data, filterTable8]);
  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-4">
          {adPlanTable8Loading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full h-10" />
              <Skeleton className="h-[250px] w-full rounded-xl" />
            </div>
          ) : (
            <DataTable
              data={filteredData}
              columns={AdPlanTable8Column}
              hiddenColumns={["location", "typeOfSP"]}
              allowSelectRow={false}
              allowViewCalendar={true}
              allowDateRange={false}
              tableType="activities"
              allowExportToExcel={false}
            />
          )}
          {adPlanTable8Error && (
            <Label className="text-destructive">{adPlanTable8Error}</Label>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
