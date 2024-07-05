import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/data-table';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { columns } from '@/components/table/data/activities/coa-columns';
import { deleteCalendarOfActivity } from '@/actions/calendar-of-activity/delete';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { FaPeopleGroup } from "react-icons/fa6";
import { Label } from '@/components/ui/label';
import { CalendarSheet } from '@/components/calendar-of-activity/CalendarSheet';
import { useSelector } from '@/app/store/store';
import { IoPeopleCircle } from 'react-icons/io5';
import { MdPeople } from 'react-icons/md';


type Props = {};

export const ViewMyParticipatedSchedDialog = (props: Props) => {
  // const { activities, loading, error, fetchActivitiesData } = useCalendarOfActivityContext();
  const { activitiesData, activityLoading, activityError } = useSelector((state)=> state.activity)
  const { currentUser } = useCurrentUser();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('');


  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
    // console.log("viewId ZZ: ", viewId)
  };

  useEffect(() => {
    // console.log("currentUser.id: ", currentUser?.id)
    if (currentUser && currentUser.name) {
      const filtered = activitiesData.filter(activity =>
        activity.participants.some(participant => participant.userId === currentUser?.id)
      );
      setFilteredData(filtered);
    }
  }, [currentUser, activitiesData]);


  useEffect(() => {
    const viewCalendarDataFiltered = filteredData.filter(activity =>
      activity.id == selectedRowId
    );
    setViewCalendarData(viewCalendarDataFiltered);
  }, [activitiesData, currentUser?.id, filteredData, selectedRowId])


  const hiddenColumns = [
    'id',
    'authorizeOther',
    'targetParticipant',
    'activityDescription',
    'timeStart',
    'timeEnd',
    'coa_id',
    'remarks',
    'userName']; // Columns to hide
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className='flex flex-row items-center gap-1 justify-center overflow-hidden text-xs lg:text-sm'>
            <MdPeople className='shrink-0'size={25}/> View participated activities
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Participated Activities


            </DialogTitle>
            <DialogDescription className='flex flex-row'>
              Total activities: <b> {filteredData.length}</b>. These activities are listed in the calendar, and you have been selected as a participant for these events.
              {activityLoading && (
                <Label className='text-xs flex flex-row gap-2 items-center ml-auto italic'>Fetching new data <LoadingSpinner /></Label>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='w-full overflow-x-auto scrollbar-thin p-1'>
            <DataTable
              data={filteredData}
              columns={columns}
              hiddenColumns={hiddenColumns}
              allowSelectRow={false}
              allowViewCalendar={true}
              onViewRowId={handleViewRowIdPressed}
              setAllowViewCalendar={() => setViewCalendar(!viewCalendar)}
              allowDateRange={true}
            />
          </div>

        </DialogContent>
      </Dialog>
      <CalendarSheet activityData={viewCalendarData} openSheet={viewCalendar} closeCalendarSheet={() => setViewCalendar(!viewCalendar)} />
    </>
  );
};
