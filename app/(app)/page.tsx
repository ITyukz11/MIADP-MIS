"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Label } from "@/components/ui/label";

import { TargetIcon } from "lucide-react";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { useEffect, useState } from "react";
import { FiActivity } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { useDispatch, useSelector } from "../store/store";
import { fetchCountCalendarActivityParticipantsData } from "../store/calendar-of-activity/countParticipantAction";
import { Skeleton } from "@/components/ui/skeleton";
import CalendarOfActivitiesReport from "./activities/report/components/CalendarOfActivitiesReport";
import { UnderDevelopmentDialog } from "@/components/UnderDevDialog";
import SelectFilterWFPYear from "./activities/components/SelectFilterWFPYear";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wfpYearOptions } from "@/lib/data/filter";
import { useSubprojectCountData } from "@/lib/subproject/useSubprojectCount";
import { useRouter } from "next/navigation";

export default function AnnouncementsPage() {
  const {
    subprojectCountData,
    subprojectCountError,
    subprojectCountLoading,
    refetchSubprojectCount,
  } = useSubprojectCountData();

  // Randomly select an image from the public/under-development folder
  const imageNumber = Math.floor(Math.random() * 6) + 1;
  const imagePath = `/under-development/${imageNumber}.png`;

  const route = useRouter();

  const {
    countParticipantActivitiesData,
    countParticipantActivityLoading,
    countParticipantActivityError,
  } = useSelector((state) => state.countParticipantActivites);
  const dispatch = useDispatch();

  useEffect(() => {
    if (countParticipantActivitiesData.length === 0) {
      dispatch(fetchCountCalendarActivityParticipantsData());
    }
  }, [countParticipantActivitiesData.length, dispatch]);

  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();

  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [openUnderDev, setOpenUnderDev] = useState<boolean>(false);

  useEffect(() => {
    if (activitiesData && Array.isArray(activitiesData)) {
      const completed = activitiesData.filter(
        (activity) => activity.status === "Completed"
      ).length;
      const total = activitiesData.length;

      setCompletedCount(completed);
      setTotalCount(total);
    }
  }, [activitiesData]);

  const handleRouteToSubproject = () => {
    route.push("/subproject");
  };

  console.log("completedCount: ", completedCount);
  console.log("totalCount: ", totalCount);
  return (
    <div className="">
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            {/* <Label className='text-xs text-gray-500'>
              ** All data here are still not real **
            </Label> */}
            <div className="flex items-center space-x-2 flex-wrap justify-center">
              <div className="hidden sm:block"></div>
              {/* <Button>Download</Button> */}
            </div>
          </div>
          <div className="relative">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="flex w-fit">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" disabled>
                  Reports
                </TabsTrigger>
                <TabsTrigger value="notifications" disabled>
                  Announcements
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => setOpenUnderDev(true)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Target WFP Activities
                      </CardTitle>
                      <TargetIcon className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                      {completedCount == 0 || totalCount == 0 ? (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-10" />
                          <Skeleton className="w-full h-5" />
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{totalCount}</div>
                          <p className="text-xs text-muted-foreground">
                            +23 added from last month
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => setOpenUnderDev(true)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Accomplished WFP Activities
                      </CardTitle>
                      <FiActivity className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                      {completedCount == 0 || totalCount == 0 ? (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-10" />
                          <Skeleton className="w-full h-5" />
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">
                            {((completedCount / totalCount) * 100).toFixed(2)}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +10.1% from last month
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => setOpenUnderDev(true)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total WFP Activities Participants
                      </CardTitle>
                      <FiUsers className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                      {countParticipantActivityLoading ? (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-10" />
                          <Skeleton className="w-full h-5" />
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">
                            {countParticipantActivitiesData.length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +19% from last month
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  <Card
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={handleRouteToSubproject}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Generated Subproject Code
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M20 7v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2zM10 4h4" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="9" y1="10" x2="9" y2="14" />
                        <line x1="15" y1="10" x2="15" y2="14" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      {subprojectCountLoading ? (
                        <div className="flex flex-col gap-2">
                          <Skeleton className="w-full h-10" />
                          <Skeleton className="w-full h-5" />
                        </div>
                      ) : subprojectCountError ? (
                        <div className="text-red-500">
                          Error: {subprojectCountError}
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">
                            {subprojectCountData.count}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            +{subprojectCountData.recentlyAdded} recently added
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <CalendarOfActivitiesReport />
              </TabsContent>
            </Tabs>
            <div className="absolute right-0 top-0 flex flex-row gap-2 items-center">
              <Label>Filter WFP Year:</Label>
              <Select
              // onValueChange={handleValueChange}
              // value={currentFilter?.wfpYear}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="All" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectGroup>
                    <SelectLabel>WFP Year</SelectLabel>
                    {wfpYearOptions.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <SelectFilterWFPYear />
          </div>
        </div>
      </div>
      <UnderDevelopmentDialog
        open={openUnderDev}
        onClose={() => setOpenUnderDev(!openUnderDev)}
      />
    </div>
  );
}
