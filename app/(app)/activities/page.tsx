"use client";
import React, { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/activities/coa-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarSheet } from "@/components/calendar-of-activity/CalendarSheet";
import { useCalendarOfActivityFilter } from "@/components/context/FilterRegionContext";
import { Label } from "@/components/ui/label";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { Card, CardContent } from "@/components/ui/card";
import { getMonth } from "@/utils/dateFormat";

const Page = () => {
  const [coaData, setCoaData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  const { currentFilter } = useCalendarOfActivityFilter();
  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();

  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
  };

  // Consolidated Filtering Logic
  const filterActivities = useMemo(() => {
    return (data: any[]) => {
      return data.filter((activity) => {
        const matchesType =
          currentFilter?.typeOfActivity === "WFP Activities"
            ? !activity.individualActivity
            : currentFilter?.typeOfActivity === "Individual Activities"
            ? activity.individualActivity
            : true;

        const matchesRegion =
          currentFilter?.region === "All" ||
          activity.user?.region === currentFilter?.region;

        const matchesUnit =
          currentFilter?.unit === "All" ||
          activity.user?.unit === currentFilter?.unit ||
          activity.user?.component === currentFilter?.unit;

        const matchesStatus =
          currentFilter?.status === "All" ||
          activity.status === currentFilter?.status;

        const matchesWFPYear =
          currentFilter?.wfpYear === "All" ||
          activity.WFPYear === currentFilter?.wfpYear;

        const matchesMonth =
          currentFilter?.month === "All" ||
          getMonth(activity.dateFrom) === currentFilter?.month;

        return (
          matchesType &&
          matchesRegion &&
          matchesUnit &&
          matchesStatus &&
          matchesWFPYear &&
          matchesMonth
        );
      });
    };
  }, [currentFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortedActivities = activitiesData.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setCoaData(sortedActivities);
        setFilteredData(filterActivities(sortedActivities));
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
    <div className="w-full max-w-[320px] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl xl:max-w-screen-2xl">
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
