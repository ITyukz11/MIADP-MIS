'use client'
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/data/activities/coa-columns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { componentOptions, regionOptions, unitOptions } from '@/lib/data/filter';
import { CalendarSheet } from '@/components/calendar-of-activity/CalendarSheet';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { useDispatch, useSelector } from '@/app/store/store';
import { fetchActivitiesData } from '@/app/store/activityAction';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';

type Props = {}

const Page = (props: Props) => {
  const [coaData, setCoaData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const {currentUser} = useCurrentUser();
  const { currentFilter, setCurrentFilter } = useCalendarOfActivityFilter();
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(currentFilter?.filter);

  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('');


  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
    // console.log("viewId ZZ: ", viewId)
  };
  // const { activities, loading, error } = useCalendarOfActivityContext();
  const dispatch = useDispatch();
  const { activitiesData, activityLoading, activityError } = useSelector((state) => state.activity);

  useEffect(() => {
    if (activitiesData.length === 0) {
      dispatch(fetchActivitiesData());
    }
  }, [dispatch, activitiesData.length]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filter out activities where 'individualActivity' is false
        const filteredActivities = activitiesData.filter((activity: any) => !activity.individualActivity);
        
        // Sort activities based on 'createdAt' in descending order
        const sortedActivities = filteredActivities.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setCoaData(sortedActivities);
        setFilteredData(sortedActivities); // Initialize filteredData with all activities sorted
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };
    fetchData();
  }, [activitiesData]);
  
  
  useEffect(() => {
    const viewCalendarDataFiltered = filteredData.filter(activity =>
      activity.id == selectedRowId
    );
    setViewCalendarData(viewCalendarDataFiltered);
  }, [activitiesData, filteredData, selectedRowId])
  

  useEffect(() => {
    if (selectedFilter === 'All') {
      setFilteredData(coaData);
    } else {
      const filtered = coaData.filter(item =>
        item.user?.region === selectedFilter ||
        item.user?.component === selectedFilter ||
        item.user?.unit === selectedFilter
      );
      setFilteredData(filtered);
    }
  }, [selectedFilter, coaData]);

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



  const handleValueChange = (value: string) => {
    setSelectedFilter(value);
    setCurrentFilter({ filter: value });
  };
  
  return (
    <div>
      <div className='flex flex-col flex-wrap w-full'>
        <div className='flex flex-row gap-2 overflow-x-auto w-full scrollbar-thin p-1'>
          <Select onValueChange={handleValueChange} value={selectedFilter} disabled={activityLoading}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder={currentUser?.region? currentUser?.region:"Filter"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All</SelectItem>
              <SelectGroup>
                <SelectLabel>Regions</SelectLabel>
                {regionOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Components</SelectLabel>
                {componentOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Units</SelectLabel>
                {unitOptions.map((option, index) => (
                  <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>  

        {filteredData.length > 0 ? (
          <div className='w-full overflow-x-auto scrollbar-thin p-1'>
            <DataTable 
              data={filteredData} 
              columns={columns} 
              hiddenColumns={hiddenColumns} 
              allowSelectRow={false}
              allowViewCalendar={true}
              onViewRowId={handleViewRowIdPressed}
              setAllowViewCalendar={()=> setViewCalendar(!viewCalendar)}
              allowDateRange={true}
              />
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        )}

      </div>
      <CalendarSheet activityData={viewCalendarData} openSheet={viewCalendar} closeCalendarSheet={() => setViewCalendar(!viewCalendar)} />
    </div>
  )
}

export default Page;
