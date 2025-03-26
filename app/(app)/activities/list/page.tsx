"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useCalendarOfActivityFilter } from "@/components/context/FilterRegionContext";
import { formatDateLong, formatDateShort, getMonth } from "@/utils/dateFormat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { getStatusColor } from "@/components/table/data/activities/coa-columns";
import { Activity } from "@/types/calendar-of-activity/calendar-of-activity";
import { CalendarSheet } from "@/components/calendar-of-activity/CalendarSheet";
import { useCalendarOfActivityMultiFilter } from "@/components/context/MultiFilterActivitiesContext";

const Page: React.FC = () => {
  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();
  const { currentMultiFilter } = useCalendarOfActivityMultiFilter();
  const [filteredData, setFilteredData] = useState<Activity[]>([]);
  const [itemsToShow, setItemsToShow] = useState(5);

  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false);

  // Helper function to apply all filters
  const applyFilters = useMemo(() => {
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

  // Apply filters and sort data
  useEffect(() => {
    if (!activitiesData) return;

    const filtered = applyFilters(activitiesData);
    const statusPriority: { [key: string]: number } = {
      Ongoing: 1,
      Upcoming: 2,
      Postponed: 3,
      Completed: 4,
      Others: 5,
    };

    const currentDate = new Date();
    const sorted = filtered.sort((a, b) => {
      const statusComparison =
        (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
      if (statusComparison !== 0) return statusComparison;

      const dateA = new Date(a.dateFrom).getTime();
      const dateB = new Date(b.dateFrom).getTime();
      return (
        Math.abs(dateA - currentDate.getTime()) -
        Math.abs(dateB - currentDate.getTime())
      );
    });

    setFilteredData(sorted);
  }, [activitiesData, applyFilters]);

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 5);
  };

  const regionColors: Record<string, string> = {
    PSO: "#C80000",
    "RPCO 9": "#ffc124",
    "RPCO 10": "#9117c2",
    "RPCO 11": "#0173bc",
    "RPCO 12": "#ff6f00",
    "RPCO 13": "#ff0090",
    BARMM: "#3cb54b",
  };

  const regionLogo: Record<string, string> = {
    PSO: "/miadp-pso.jpg",
    "RPCO 9": "/miadp-region-ix.jpg",
    "RPCO 10": "/miadp-region-x.jpg",
    "RPCO 11": "/miadp-region-xi.jpg",
    "RPCO 12": "/miadp-region-xii.jpg",
    "RPCO 13": "/miadp-region-xiii.jpg",
    BARMM: "/miadp-barmm.jpg",
  };

  const cryingCat = [
    "/crying-cat/crying-cat-1.gif",
    "/crying-cat/crying-cat-2.gif",
    "/crying-cat/crying-cat-3.gif",
    "/crying-cat/crying-cat-4.gif",
    "/crying-cat/crying-cat-5.gif",
  ];

  if (activityError) {
    return <Label className="text-destructive">{activityError}</Label>;
  }

  if (activityLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-5xl self-center w-full">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Label className="text-destructive text-3xl font-bold">No data</Label>
        <Image
          src={cryingCat[Math.floor(Math.random() * cryingCat.length)]}
          width={300}
          height={300}
          alt="Crying cat"
          className="rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl self-center w-full">
      <div className="space-y-4">
        {filteredData.slice(0, itemsToShow).map((data) => (
          <Card
            key={data.id}
            className="shadow-md cursor-pointer dark:hover:bg-slate-900 hover:bg-neutral-100"
            onClick={() => {
              setViewCalendarData([data]);
              setViewCalendar(!viewCalendar);
            }}
          >
            <CardContent className="flex flex-row p-4 gap-4 relative overflow-hidden rounded-tr-xl">
              {/* Region Color */}
              <div
                className="absolute -top-8 -right-16 md:-top-6 md:-right-12 w-28 rotate-45 h-16 shadow-md md:flex justify-center items-center border-2 cursor-pointer"
                style={{ backgroundColor: regionColors[data.user.region] }}
              ></div>

              {/* Image Section */}
              <div className="flex-shrink-0 gap-4 hidden md:flex flex-col">
                <Image
                  src={regionLogo[data.user.region]}
                  width={80}
                  height={80}
                  alt={`${data.activityTitle} logo`}
                  className="rounded-full cursor-pointer"
                />
                <Badge
                  className={`font-medium shadow-sm z-10 dark:text-white cursor-pointer hover:${getStatusColor(
                    data.status
                  )} ${getStatusColor(data.status)}`}
                >
                  {data.status}
                  {data.status === "Ongoing" && (
                    <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
                  )}
                </Badge>
              </div>

              {/* Information Section */}
              <div className="flex flex-col gap-2 w-full md:pr-14">
                <div className="flex items-center">
                  <Label className="cursor-pointer">
                    <span className="font-bold text-xs sm:text-sm md:text-lg">
                      {data.dateFrom === data.dateTo
                        ? formatDateLong(data.dateFrom)
                        : `${formatDateShort(data.dateFrom)} - ${formatDateLong(
                            data.dateTo
                          )}`}{" "}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold cursor-pointer">
                      | {data.type} |{" "}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base pr-5">
                      {data.location}
                    </span>
                  </Label>
                </div>
                <Label className="text-sm sm:text-md md:text-xl font-semibold cursor-pointer">
                  {data.activityTitle}
                </Label>
                <div className="text-sm flex gap-2 flex-wrap items-center">
                  {data.targetParticipant.split(",").map((item, index) => (
                    <Badge key={index}>{item.trim()}</Badge>
                  ))}
                  <Separator
                    orientation="vertical"
                    className="h-4 mx-2 lg:block hidden"
                  />
                  <Badge>{data.user.region}</Badge>
                  <Badge>{data.user.component}</Badge>
                  {data.user.unit && (
                    <Badge className="cursor-pointer">{data.user.unit}</Badge>
                  )}
                  <Separator
                    orientation="vertical"
                    className="hidden lg:block h-4 mx-2"
                  />
                  <Badge className="cursor-pointer">{data.WFPYear}</Badge>
                  <Badge
                    className={`md:hidden flex font-medium shadow-sm z-10 dark:text-white cursor-pointer hover:${getStatusColor(
                      data.status
                    )} ${getStatusColor(data.status)}`}
                  >
                    {data.status}
                    {data.status === "Ongoing" && (
                      <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
                    )}
                  </Badge>
                </div>
                <Label className="cursor-pointer text-xs md:text-sm">
                  {data.activityDescription}
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.slice(0, itemsToShow).length < filteredData.length && (
        <div className="mt-6 text-center">
          <Button onClick={handleLoadMore}>Load More</Button>
        </div>
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
