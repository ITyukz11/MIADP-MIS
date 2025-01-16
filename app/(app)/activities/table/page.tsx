"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/activities/coa-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarSheet } from "@/components/calendar-of-activity/CalendarSheet";
import { useDispatch, useSelector } from "@/app/store/store";
import { fetchActivitiesData } from "@/app/store/activityAction";
import { useCalendarOfActivityFilter } from "@/components/context/FilterRegionContext";
import { Label } from "@/components/ui/label";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { Card, CardContent } from "@/components/ui/card";

type Props = {};

const Page = (props: Props) => {
  const [coaData, setCoaData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { currentFilter } = useCalendarOfActivityFilter();

  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
  };

  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filter activities based on typeOfActivity
        const filteredActivities = activitiesData.filter((activity: any) => {
          if (currentFilter?.typeOfActivity === "WFP Activities") {
            return !activity.individualActivity; // Only WFP Activities
          } else if (
            currentFilter?.typeOfActivity === "Individual Activities"
          ) {
            return activity.individualActivity; // Only Individual Activities
          }
          return true; // If no specific type is selected, include all activities
        });

        // Sort activities based on 'createdAt' in descending order
        const sortedActivities = filteredActivities.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setCoaData(sortedActivities);
        setFilteredData(sortedActivities); // Initialize filteredData with all activities sorted
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };
    fetchData();
  }, [activitiesData, currentFilter]);

  useEffect(() => {
    const viewCalendarDataFiltered = filteredData.filter(
      (activity) => activity.id == selectedRowId
    );
    setViewCalendarData(viewCalendarDataFiltered);
  }, [activitiesData, filteredData, selectedRowId]);

  useEffect(() => {
    if (
      currentFilter?.region === "All" &&
      currentFilter?.unit === "All" &&
      currentFilter?.status === "All"
    ) {
      console.log("1");
      console.log("region: ", currentFilter?.region);
      console.log("unit/component: ", currentFilter?.unit);
      console.log("status: ", currentFilter?.status);
      setFilteredData(coaData); // Return all data
    } else if (
      currentFilter?.region !== "All" &&
      currentFilter?.unit === "All" &&
      currentFilter?.status === "All"
    ) {
      console.log("2");
      const filtered = coaData.filter(
        (item) => item.user?.region === currentFilter?.region
      );
      setFilteredData(filtered); // Filter by region only
    } else if (
      currentFilter?.region === "All" &&
      currentFilter?.unit !== "All" &&
      currentFilter?.status === "All"
    ) {
      console.log("3");
      const filtered = coaData.filter(
        (item) =>
          item.user?.unit === currentFilter?.unit ||
          item.user?.component === currentFilter?.unit
      );
      setFilteredData(filtered); // Filter by unit/component only
    } else if (
      currentFilter?.region !== "All" &&
      currentFilter?.unit !== "All" &&
      currentFilter?.status === "All"
    ) {
      console.log("4");
      const filtered = coaData.filter(
        (item) =>
          item.user?.region === currentFilter?.region &&
          (item.user?.unit === currentFilter?.unit ||
            item.user?.component === currentFilter?.unit)
      );
      setFilteredData(filtered); // Filter by region and unit/component
    } else {
      console.log("5");
      // Combine all filters including status
      const filtered = coaData.filter(
        (item) =>
          (currentFilter?.region === "All" ||
            item.user?.region === currentFilter?.region) &&
          (currentFilter?.unit === "All" ||
            item.user?.unit === currentFilter?.unit ||
            item.user?.component === currentFilter?.unit) &&
          (currentFilter?.status === "All" ||
            item.status === currentFilter?.status)
      );
      setFilteredData(filtered); // Apply all filters
    }
  }, [coaData, currentFilter]);

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
      <div className="flex flex-col flex-wrap w-full">
        {!activityLoading ? (
          <Card className="w-full overflow-auto crollbar-thin p-1">
            <CardContent className="p-4">
              <DataTable
                data={filteredData}
                columns={columns}
                hiddenColumns={hiddenColumns}
                allowSelectRow={false}
                allowViewCalendar={true}
                onViewRowId={handleViewRowIdPressed}
                setAllowViewCalendar={() => setViewCalendar(!viewCalendar)}
                allowDateRange={true}
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
          <Label className=" text-destructive">{activityError}</Label>
        )}
      </div>
      <CalendarSheet
        activityData={viewCalendarData}
        openSheet={viewCalendar}
        closeCalendarSheet={() => setViewCalendar(!viewCalendar)}
      />
    </div>
  );
};

export default Page;
