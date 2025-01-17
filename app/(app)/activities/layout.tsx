"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import MajorOrIndividualDialog from "./major-or-individual-dialog";
import CalendarFormDialog from "./calendar-form-dialog";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { Calendar, List, TableIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { ViewMySchedDialog } from "./view-my-sched-dialog";
import { ViewMyParticipatedSchedDialog } from "./view-participated-activity-dialog";
import { FaPlusCircle } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { usePathname } from "next/navigation";
import SelectFilterRegUniCom from "./components/SelectFilterRegUniCom";
import SelectTypeOfActivity from "./components/SelectTypeOfActivity";
import SelectFilterUnitComponent from "./components/SelectFilterUnit";
import SelectFilterStatus from "./components/SelectFilterStatus";
import SelectFilterWFPYear from "./components/SelectFilterWFPYear";
import SelectFilterMonth from "./components/SelectFilterMonth";
import { IoMdHelpCircle } from "react-icons/io";
import MIADPColorCodeDialog from "./components/Dialog/MIADPColorCode";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Select from ShadCN or your UI library

interface ActivitiesLayoutProps {
  children: React.ReactNode;
}

export default function ActivitiesLayout({ children }: ActivitiesLayoutProps) {
  const [planningActivityOpen, setPlanningActivityOpen] = useState(false);
  const [calendarFormOpen, setCalendarFormOpen] = useState(false);
  const [individualActivity, setIndividualActivity] = useState(false);

  const [viewMapColorCode, setViewMapColorCode] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

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

  console.log("ACTIVITY PARENT RENDERS");

  const links = [
    { href: "/activities/list", label: "List", icon: <List size={22} /> },
    { href: "/activities", label: "Table", icon: <TableIcon size={22} /> },
    {
      href: "/activities/calendar",
      label: "Calendar",
      icon: <Calendar size={22} />,
    },
    {
      href: "/activities/report",
      label: "Report",
      icon: <TbReportAnalytics size={25} />,
    },
  ];

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
            {/* <div className="flex sm:justify-end justify-center">
              {isMobile ? (
                // Use Select for small screens
                <Select
                  onValueChange={(value) => {
                    window.location.href = value; // Navigate to the selected link
                  }}
                >
                  <SelectTrigger className="w-full text-xs md:text-sm md:w-fit">
                    <span>
                      {
                        // Display the active link label based on pathname
                        links.find((link) => pathname === link.href)?.label ||
                          "Select View"
                      }
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {links.map((link) => (
                      <SelectItem
                        key={link.href}
                        value={link.href}
                        className={cn("flex items-center gap-2", {
                          " bg-slate-100 dark:text-slate-800":
                            pathname === link.href, // Highlight the selected item
                        })}
                      >
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                          {link.icon}
                          {link.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                // Render links as buttons for larger screens
                <div className="flex sm:flex-row gap-2 flex-wrap">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        className={cn("text-xs lg:text-sm", {
                          "font-bold underline": pathname === link.href,
                        })}
                      >
                        {link.icon}
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div> */}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card className="flex flex-row gap-2 w-full shadow-none">
          <CardContent className="flex items-center justify-center md:justify-start gap-2 w-full p-4 flex-wrap">
            <SelectTypeOfActivity />
            <SelectFilterRegUniCom />
            <SelectFilterUnitComponent />
            <SelectFilterStatus />
            <SelectFilterMonth />
            <SelectFilterWFPYear />
            <Button
              className="md:ml-auto lg:flex flex-row hidden"
              onClick={() => setViewMapColorCode(true)}
            >
              <IoMdHelpCircle className="shrink-0 w-10 h-10" />
              Legend
            </Button>
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
