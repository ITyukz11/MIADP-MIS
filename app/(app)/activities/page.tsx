'use client'
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/data/activities/coa-columns';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarSheet } from '@/components/calendar-of-activity/CalendarSheet';
import { useDispatch, useSelector } from '@/app/store/store';
import { fetchActivitiesData } from '@/app/store/activityAction';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { Label } from '@/components/ui/label';
import SelectTypeOfActivity from './components/SelectTypeOfActivity';
import SelectFilterRegUniCom from './components/SelectFilterRegUniCom';
import SelectFilterUnit from './components/SelectFilterUnit';
import { useActivitiesData } from '@/lib/calendar-of-activity/useActivitiesDataHook';

type Props = {}

const Page = (props: Props) => {
  const [coaData, setCoaData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { currentFilter } = useCalendarOfActivityFilter();

  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('');

  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
    // console.log("viewId ZZ: ", viewId)
  };
  // const { activities, loading, error } = useCalendarOfActivityContext();

  // const dispatch = useDispatch();
  // const { activitiesData, activityLoading, activityError } = useSelector((state) => state.activity);
  const { activitiesData, activityError, activityLoading } = useActivitiesData()
  // useEffect(() => {
  //   if (activitiesData.length === 0) {
  //     dispatch(fetchActivitiesData());
  //   }
  // }, [dispatch, activitiesData.length]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filter activities based on typeOfActivity
        const filteredActivities = activitiesData.filter((activity: any) => {
          if (currentFilter?.typeOfActivity === 'WFP Activities') {
            return !activity.individualActivity; // Only WFP Activities
          } else if (currentFilter?.typeOfActivity === 'Individual Activities') {
            return activity.individualActivity; // Only Individual Activities
          }
          return true; // If no specific type is selected, include all activities
        });

        // Sort activities based on 'createdAt' in descending order
        const sortedActivities = filteredActivities.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCoaData(sortedActivities);
        setFilteredData(sortedActivities); // Initialize filteredData with all activities sorted
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };
    fetchData();
  }, [activitiesData, currentFilter]);

  useEffect(() => {
    const viewCalendarDataFiltered = filteredData.filter(activity =>
      activity.id == selectedRowId
    );
    setViewCalendarData(viewCalendarDataFiltered);
  }, [activitiesData, filteredData, selectedRowId])


  useEffect(() => {
    if (currentFilter?.filter === 'All' && currentFilter?.unit === 'All') {
      console.log("1");
      console.log("region: ", currentFilter?.filter);
      console.log("unit/component: ", currentFilter?.unit);
      setFilteredData(coaData);  // Return all data
    } 
    else if (currentFilter?.filter !== 'All' && currentFilter?.unit === 'All') {
      console.log("2");
      console.log("region: ", currentFilter?.filter);
      console.log("unit/component: ", currentFilter?.unit);
      const filtered = coaData.filter(item =>
        item.user?.region === currentFilter?.filter
      );
      setFilteredData(filtered);  // Filter by region only
    }
    else if (currentFilter?.filter === 'All' && currentFilter?.unit !== 'All') {
      console.log("3");
      console.log("region: ", currentFilter?.filter);
      console.log("unit/component: ", currentFilter?.unit);
      const filtered = coaData.filter(item =>
        item.user?.unit === currentFilter?.unit || 
        item.user?.component === currentFilter?.unit
      );
      setFilteredData(filtered);  // Filter by unit/component only
    }
    else if (currentFilter?.filter !== 'All' && currentFilter?.unit !== 'All') {
      console.log("4");
      console.log("region: ", currentFilter?.filter);
      console.log("unit/component: ", currentFilter?.unit);
      const filtered = coaData.filter(item =>
        item.user?.region === currentFilter?.filter &&
        (
          item.user?.unit === currentFilter?.unit || 
          item.user?.component === currentFilter?.unit
        )
      );
      setFilteredData(filtered);  // Filter by both region and unit/component
    }
  }, [currentFilter, coaData]);
  
  

  const hiddenColumns = [
    'id',
    'authorizeOther',
    'targetParticipant',
    'activityDescription',
    'timeStart',
    'timeEnd',
    'coa_id',
    'remarks',
    'userName'
  ]; // Columns to hide

  return (
    <div>
      <div className='flex flex-col flex-wrap w-full'>
        <div className='flex flex-row gap-2 overflow-x-auto w-full scrollbar-thin p-1'>
          <SelectFilterRegUniCom/>
          <SelectFilterUnit/>
          <SelectTypeOfActivity/>
        </div>

        {!activityLoading ? (
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
              allowExportToExcel
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        )}
        {activityError && <Label className=' text-destructive'>{activityError}</Label>}
      </div>
      <CalendarSheet activityData={viewCalendarData} openSheet={viewCalendar} closeCalendarSheet={() => setViewCalendar(!viewCalendar)} />
    </div>
  )
}

export default Page;
