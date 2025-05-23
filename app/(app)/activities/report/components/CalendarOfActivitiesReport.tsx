"use client";
import { fetchCountActivitiesData } from "@/app/store/countActivityAction";
import { fetchComponentCountsData } from "@/app/store/countComponentActivityAction";
import { useDispatch, useSelector } from "@/app/store/store";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CountComponentActivity } from "@/types/calendar-of-activity/calendar-of-activity";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCountActivityParticipantsData } from "@/app/store/calendar-of-activity/countActivityParticipantAction";
import { DataTable } from "@/components/table/data-table";
import { countParticipantActivityColumn } from "@/components/table/data/activities/count-participant-activity-column";
import ChartSwitcher, { ChartType } from "./ChartSwitcher";
import { useActivitiesCountData } from "@/lib/calendar-of-activity/countActivities";
import { useActivitiesCountComponentsData } from "@/lib/calendar-of-activity/countActivitiesByComponent";

const CalendarOfActivitiesReport = () => {
  const {
    activitiesCountData,
    activitiesCountError,
    activitiesCountLoading,
    refetchActivitiesCount,
  } = useActivitiesCountData();

  const dispatch = useDispatch();
  // const { countActivitiesData, countActivityLoading, countActivityError } =
  //   useSelector((state) => state.countActivity);
  const {
    countParticipantActivitiesData,
    countParticipantActivityLoading,
    countParticipantActivityError,
  } = useSelector((state) => state.countActivityParticipant);
  // useEffect(() => {
  //   if (Object.keys(countActivitiesData).length === 0) {
  //     dispatch(fetchCountActivitiesData());
  //   }
  // }, [dispatch, countActivitiesData.length, countActivitiesData]);

  useEffect(() => {
    if (Object.keys(countParticipantActivitiesData).length === 0) {
      console.log("countParticipantActivitiesData FETCHING");
      dispatch(fetchCountActivityParticipantsData());
    }
  }, [countParticipantActivitiesData, dispatch]);
  const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);

  // Ensure the data is typed correctly
  const sortedActivities = activitiesCountData
    ? Object.entries(activitiesCountData as Record<string, number>).sort(
        ([, countA], [, countB]) => countB - countA
      )
    : [];

  const {
    componentActivityCountsData,
    componentActivityCountsLoading,
    componentActivityCountsError,
  } = useSelector((state) => state.countByComponentActivity);

  const { activitiesCountComponentData, activitiesCountComponentLoading } =
    useActivitiesCountComponentsData();

  useEffect(() => {
    if (Object.keys(componentActivityCountsData).length === 0) {
      dispatch(fetchComponentCountsData());
    }
  }, [dispatch, componentActivityCountsData]);

  interface ComponentActivityData {
    name: string;
    amt: number;
    [key: string]: number | string; // Allow dynamic keys with number or string values
  }

  const transformData = (
    data: CountComponentActivity
  ): ComponentActivityData[] => {
    // Extract all unique components
    const components = Array.from(
      new Set(Object.values(data).flatMap((region) => Object.keys(region)))
    );

    // Convert the data to the format required by the BarChart
    return Object.entries(data).map(([region, counts]) => {
      // Create an object with component counts and total amount
      const transformed: ComponentActivityData = {
        name: region,
        amt: Object.values(counts).reduce((sum, count) => sum + count, 0),
      };

      // Add counts for each component
      components.forEach((component) => {
        transformed[component] = counts[component] || 0;
      });
      return transformed;
    });
  };

  const handleChange = (value: string) => {
    setChartType(value as ChartType);
  };
  return (
    <>
      {/* Adjusted flex layout */}
      <div className="flex flex-wrap gap-4">
        {/* Rankings Card */}
        <Card className="flex-1 lg:w-1/4 flex-shrink-0">
          <CardHeader>
            <CardTitle>
              Rankings
              <Label className="ml-2 text-xs text-gray-500">
                ** Most activities **
              </Label>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-fit overflow-y-auto scrollbar-thin">
              <ol className="space-y-1">
                {activitiesCountLoading
                  ? [...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))
                  : sortedActivities?.map(([region, count], index) => (
                      <React.Fragment key={index}>
                        <li
                          className={`flex items-center p-2 rounded-md ${
                            index === 0
                              ? "bg-yellow-100 border border-yellow-300"
                              : ""
                          }`}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <Image
                              src={
                                region == "PSO"
                                  ? "/miadp-pso.jpg"
                                  : region == "RPCO 9"
                                  ? "/miadp-region-ix.jpg"
                                  : region == "RPCO 10"
                                  ? "/miadp-region-x.jpg"
                                  : region == "RPCO 11"
                                  ? "/miadp-region-xi.jpg"
                                  : region == "RPCO 12"
                                  ? "/miadp-region-xii.jpg"
                                  : region == "RPCO 13"
                                  ? "/miadp-region-xiii.jpg"
                                  : "/miadp-barmm.jpg"
                              }
                              alt="region image"
                              className="rounded-full"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="flex flex-row gap-2 items-center lg:items-start lg:flex-col lg:gap-0">
                            <div className="flex items-center">
                              <span
                                className={`text-lg font-semibold ${
                                  index === 0 && "text-black"
                                }`}
                              >
                                {region}
                              </span>
                              {index === 0 && (
                                <FaCrown
                                  className="ml-2 text-yellow-500"
                                  size={24}
                                />
                              )}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {count} activities
                            </span>
                          </div>
                        </li>
                        <Separator />
                      </React.Fragment>
                    ))}
                {activitiesCountError && (
                  <Label className="text-red-500">
                    *{activitiesCountError}
                  </Label>
                )}
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Chart Card */}
        <Card className="w-full lg:w-3/4">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>
                Total Activities by Region
                <Label className="ml-2 text-xs text-gray-500">
                  ** All data presented here represents the totals from the
                  major activities encoded over time. **
                </Label>
              </CardTitle>
            </div>
            <div className="mt-2 md:mt-0">
              <Select
                value={chartType}
                onValueChange={handleChange}
                defaultValue={ChartType.BAR}
              >
                <SelectTrigger className="text-xs sm:text-sm w-full md:w-auto">
                  <SelectValue placeholder="Select Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ChartType.BAR}>{ChartType.BAR}</SelectItem>
                  <SelectItem value={ChartType.LINE}>
                    {ChartType.LINE}
                  </SelectItem>
                  <SelectItem value={ChartType.AREA}>
                    {ChartType.AREA}
                  </SelectItem>
                  <SelectItem value={ChartType.RADAR}>
                    {ChartType.RADAR}
                  </SelectItem>
                  <SelectItem value={ChartType.TREEMAP}>
                    {ChartType.TREEMAP}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {activitiesCountComponentLoading ||
            !activitiesCountComponentData ? (
              <div className="h-72 flex flex-col gap-4">
                <Skeleton className="h-6 w-32" /> {/* Fake chart title */}
                <Skeleton className="h-full w-full rounded-md" />{" "}
                {/* Fake chart body */}
              </div>
            ) : Object.keys(activitiesCountComponentData).length === 0 ? (
              <Label className="text-gray-500">No activity data found.</Label>
            ) : (
              <ChartSwitcher
                data={transformData(activitiesCountComponentData)}
                typeChart={chartType}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Table Section */}
      {/* <div className="mt-4">
        {activitiesCountComponentLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Total activities as participants</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center max-w-full">
              <DataTable
                data={countParticipantActivitiesData}
                columns={countParticipantActivityColumn}
                allowDateRange={false}
                allowSelectRow={false}
              />
            </CardContent>
          </Card>
        )}
      </div> */}
    </>
  );
};

export default CalendarOfActivitiesReport;
