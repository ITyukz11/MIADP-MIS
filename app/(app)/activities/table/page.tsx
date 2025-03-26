"use client";
import React, { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/activities/coa-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarSheet } from "@/components/calendar-of-activity/CalendarSheet";
import { Label } from "@/components/ui/label";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { Card, CardContent } from "@/components/ui/card";
import { getMonth } from "@/utils/dateFormat";
import { useCalendarOfActivityMultiFilter } from "@/components/context/MultiFilterActivitiesContext";

const Page = () => {
  const [coaData, setCoaData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  const { currentMultiFilter } = useCalendarOfActivityMultiFilter();
  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();

  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
  };

  // Consolidated Filtering Logic
  const filterActivities = useMemo(() => {
    return (data: any[]) => {
      return data.filter((activity) => {
        // const matchesType =
        //   currentFilter?.typeOfActivity === "WFP Activities"
        //     ? !activity.individualActivity
        //     : currentFilter?.typeOfActivity === "Individual Activities"
        //     ? activity.individualActivity
        //     : true;
        const matchesType =
          currentMultiFilter?.typeOfActivity?.includes("All") ||
          (currentMultiFilter?.typeOfActivity?.includes("WFP Activities") &&
            !activity.individualActivity) ||
          (currentMultiFilter?.typeOfActivity?.includes(
            "Individual Activities"
          ) &&
            activity.individualActivity);

        // const matchesRegion =
        //   currentFilter?.region === "All" ||
        //   activity.user?.region === currentFilter?.region;

        const matchesRegion =
          !currentMultiFilter?.region || // If no filter is applied, show all
          currentMultiFilter.region.includes("All") || // If "All" is selected, show all
          (Array.isArray(currentMultiFilter.region) &&
            currentMultiFilter.region.includes(activity.user?.region || ""));

        // const matchesActivityType =
        //   currentFilter?.type === "All" ||
        //   activity.type === currentFilter?.type;
        const matchesActivityType =
          currentMultiFilter?.type?.includes("All") ||
          currentMultiFilter?.type?.includes(activity.type);

        // const matchesUnit =
        //   currentFilter?.unit === "All" ||
        //   activity.user?.unit === currentFilter?.unit ||
        //   activity.user?.component === currentFilter?.unit;
        const matchesUnit =
          !currentMultiFilter?.unit || // If no filter is applied, show all
          currentMultiFilter.unit.includes("All") || // If "All" is selected, show all
          (Array.isArray(currentMultiFilter.unit) &&
            (currentMultiFilter.unit.includes(activity.user?.unit || "") ||
              currentMultiFilter.unit.includes(
                activity.user?.component || ""
              )));

        // const matchesStatus =
        //   currentFilter?.status === "All" ||
        //   activity.status === currentFilter?.status;

        const matchesStatus =
          currentMultiFilter?.status.includes("All") ||
          currentMultiFilter?.status.includes(activity.status);

        // const matchesWFPYear =
        //   currentFilter?.wfpYear === "All" ||
        //   activity.WFPYear === currentFilter?.wfpYear;

        const matchesWFPYear =
          currentMultiFilter?.wfpYear.includes("All") ||
          currentMultiFilter?.wfpYear.includes(activity.WFPYear);

        // const matchesMonth =
        //   currentFilter?.month === "All" ||
        //   getMonth(activity.dateFrom) === currentFilter?.month;
        const matchesMonth =
          currentMultiFilter?.month.includes("All") || // Show all if "All" is selected
          currentMultiFilter?.month.some(
            (month: string) => month === getMonth(activity.dateFrom)
          );

        return (
          matchesType &&
          matchesActivityType &&
          matchesRegion &&
          matchesUnit &&
          matchesStatus &&
          matchesWFPYear &&
          matchesMonth
        );
      });
    };
  }, [currentMultiFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activitiesData) {
          const sortedActivities = activitiesData.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setCoaData(sortedActivities);
          setFilteredData(filterActivities(sortedActivities));
        }
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };

    fetchData();
  }, [activitiesData, filterActivities]);

  useEffect(() => {
    setViewCalendarData(
      filteredData.filter((activity) => activity.id === selectedRowId)
    );
  }, [filteredData, selectedRowId]);

  const hiddenColumns = [
    "id",
    "authorizeOther",
    "targetParticipant",
    "activityDescription",
    "timeStart",
    "timeEnd",
    "coa_id",
    "remarks",
    "userName",
  ]; // Columns to hide

  return (
    <div className="w-full">
      {!activityLoading ? (
        <Card>
          <CardContent className="p-4">
            <DataTable
              data={filteredData}
              columns={columns}
              hiddenColumns={hiddenColumns}
              allowSelectRow={false}
              allowViewCalendar={true}
              onViewRowId={handleViewRowIdPressed}
              setAllowViewCalendar={() => setViewCalendar(!viewCalendar)}
              allowDateRange={false}
              tableType="activities"
              allowExportToExcel
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      )}
      {activityError && (
        <Label className="text-destructive">{activityError}</Label>
      )}
      <CalendarSheet
        activityData={viewCalendarData}
        openSheet={viewCalendar}
        closeCalendarSheet={() => setViewCalendar(!viewCalendar)}
      />
    </div>
  );
};

export default Page;
