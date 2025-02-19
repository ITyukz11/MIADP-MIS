import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/activities/coa-columns";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Label } from "@/components/ui/label";
import { CalendarSheet } from "@/components/calendar-of-activity/CalendarSheet";
import { MdPeople } from "react-icons/md";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { useSession } from "next-auth/react";

type Props = {};

const ViewMyParticipatedSchedDialog = (props: Props) => {
  const { activitiesData, activityError, activityLoading } =
    useActivitiesData();
  const { data: currentUser } = useSession();
  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
  };

  console.log("view activitiesData: ", activitiesData);
  console.log("view currentUser: ", currentUser);
  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!currentUser?.user.id || !activitiesData) {
      return [];
    }

    return activitiesData.filter((activity: any) =>
      activity.participants.some(
        (participant: any) => participant.userId === currentUser.user.id
      )
    );
  }, [currentUser, activitiesData]);

  // Update calendar data when row ID changes
  useEffect(() => {
    const viewCalendarDataFiltered = filteredData.filter(
      (activity: { id: string }) => activity.id === selectedRowId
    );
    setViewCalendarData(viewCalendarDataFiltered);
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
  ];

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-row items-center gap-1 justify-center overflow-hidden text-xs lg:text-sm"
          >
            <MdPeople className="shrink-0" size={25} />
            <span className="md:block hidden">
              {" "}
              View participated activities
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participated Activities</DialogTitle>
            <DialogDescription className="flex flex-row">
              Total activities: <b> {filteredData.length}</b>. These activities
              are listed in the calendar, and you have been selected as a
              participant for these events.
              {activityLoading && (
                <Label className="text-xs flex flex-row gap-2 items-center ml-auto italic">
                  Fetching new data <LoadingSpinner />
                </Label>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full overflow-x-auto scrollbar-thin p-1">
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
          </div>
        </DialogContent>
      </Dialog>
      <CalendarSheet
        activityData={viewCalendarData}
        openSheet={viewCalendar}
        closeCalendarSheet={() => setViewCalendar(!viewCalendar)}
      />
    </>
  );
};

export default React.memo(ViewMyParticipatedSchedDialog);
