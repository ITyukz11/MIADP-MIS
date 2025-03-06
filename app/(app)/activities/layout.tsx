"use client";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import MajorOrIndividualDialog from "./major-or-individual-dialog";
import CalendarFormDialog from "./calendar-form-dialog";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { RefreshCcw } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { ViewMySchedDialog } from "./view-my-sched-dialog";
import ViewMyParticipatedSchedDialog from "./view-participated-activity-dialog";
import { FaPlusCircle } from "react-icons/fa";
import SelectFilterRegUniCom from "./components/SelectFilterRegUniCom";
import SelectTypeOfActivity from "./components/SelectTypeOfActivity";
import SelectFilterUnitComponent from "./components/SelectFilterUnit";
import SelectFilterStatus from "./components/SelectFilterStatus";
import SelectFilterWFPYear from "./components/SelectFilterWFPYear";
import SelectFilterMonth from "./components/SelectFilterMonth";
import { IoMdHelpCircle } from "react-icons/io";
import MIADPColorCodeDialog from "./components/Dialog/MIADPColorCode";
import SelecterFilterType from "./components/SelecterFilterType";

interface ActivitiesLayoutProps {
  children: React.ReactNode;
}

export default function ActivitiesLayout({ children }: ActivitiesLayoutProps) {
  const [planningActivityOpen, setPlanningActivityOpen] = useState(false);
  const [calendarFormOpen, setCalendarFormOpen] = useState(false);
  const [individualActivity, setIndividualActivity] = useState(false);

  const [viewMapColorCode, setViewMapColorCode] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // Local loading state

  const { refetchActivities, activityLoading } = useActivitiesData();

  const handleSetIndividualActivity = useCallback((isIndividual: boolean) => {
    setIndividualActivity(isIndividual);
  }, []);

  const handleSetViewMapColorCode = useCallback(() => {
    setViewMapColorCode((prevState) => !prevState);
  }, []);

  const handleSetCalendarFormOpen = useCallback(() => {
    setCalendarFormOpen((prevState) => !prevState);
  }, []);

  const handlePlanningActivityOpen = useCallback(() => {
    setPlanningActivityOpen((prevState) => !prevState);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true); // Start loading
    try {
      await refetchActivities(); // Wait for data to refetch
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
              Calendar of Activities{" "}
            </h2>
          </div>
          <Label className="text-xs sm:text-sm text-muted-foreground">
            Explore and manage your scheduled activities with ease. This
            calendar provides a comprehensive view of all planned activities,
            allowing you to stay organized and efficient.
          </Label>
        </div>
        <Card className="flex flex-row gap-2 w-full shadow-none">
          <CardContent className="flex items-center justify-center md:justify-between gap-2 w-full p-4 flex-wrap">
            <div className="flex flex-wrap justify-center md:justify-start sm:flex-row gap-2 ">
              <Button
                variant="default"
                className="flex flex-row items-center gap-1 justify-center text-xs lg:text-sm"
                onClick={() => setPlanningActivityOpen(true)}
              >
                <FaPlusCircle size={18} className="shrink-0" />
                <span className="md:block hidden">Create new activity</span>
              </Button>
              <ViewMySchedDialog />
              <ViewMyParticipatedSchedDialog />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card className="flex flex-row gap-2 w-full shadow-none">
          <CardContent className="flex items-center justify-center md:justify-start gap-2 w-full p-4 flex-wrap">
            <SelectTypeOfActivity />
            <SelecterFilterType />
            <SelectFilterRegUniCom />
            <SelectFilterUnitComponent />
            <SelectFilterStatus />
            <SelectFilterMonth />
            <SelectFilterWFPYear />
            <div className="flex flex-row gap-2 md:ml-auto">
              <Button
                onClick={handleRefresh}
                disabled={activityLoading || isRefreshing}
              >
                {isRefreshing ? (
                  <span className="flex items-center">
                    <span className="spinner mr-2"></span> Fetching latest
                    data...
                  </span>
                ) : (
                  <>
                    Fetch Data <RefreshCcw />
                  </>
                )}
              </Button>

              <Button
                className="lg:flex flex-row hidden"
                onClick={() => setViewMapColorCode(true)}
              >
                <IoMdHelpCircle className="shrink-0 w-10 h-10" />
                Legend
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 flex justify-center items-center">
        {children}
      </div>
      <MajorOrIndividualDialog
        open={planningActivityOpen}
        setClose={handlePlanningActivityOpen}
        setCalendarFormOpen={handleSetCalendarFormOpen}
        setIndividualActivity={handleSetIndividualActivity}
      />

      <CalendarFormDialog
        open={calendarFormOpen}
        setClose={handleSetCalendarFormOpen}
        individualActivity_={individualActivity}
      />
      <MIADPColorCodeDialog
        open={viewMapColorCode}
        setClose={handleSetViewMapColorCode}
      />
    </div>
  );
}
