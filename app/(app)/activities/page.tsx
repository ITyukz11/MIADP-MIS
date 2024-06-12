'use client'
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { columns } from '@/components/table/data/activities/coa-columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCalendarOfActivityContext } from '@/components/context/CalendarOfActivityContext';
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

type Props = {}

const Page = (props: Props) => {
  const [coaData, setCoaData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [viewCalendarData, setViewCalendarData] = useState<any[]>([]);
  const [viewCalendar, setViewCalendar] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState('');


  const handleViewRowIdPressed = (viewId: string) => {
    setSelectedRowId(viewId);
    console.log("viewId ZZ: ", viewId)
  };
  const { activities, loading, error } = useCalendarOfActivityContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sorting activities based on 'createdAt' in descending order
        const sortedActivities = [...activities].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setCoaData(sortedActivities);
        setFilteredData(sortedActivities); // Initialize filteredData with all activities sorted
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };
    fetchData();
  }, [activities]);
  
  useEffect(() => {
    const viewCalendarDataFiltered = filteredData.filter(activity =>
      activity.id == selectedRowId
    );
    setViewCalendarData(viewCalendarDataFiltered);
  }, [activities, filteredData, selectedRowId])
  

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
    'target_participant',
    'activityDescription',
    'timeStart',
    'timeEnd',
    'coa_id',
    'remarks',
    'userName'
  ]; // Columns to hide

  return (
    <div className='container relative'>
      <div className='flex flex-col flex-wrap w-full'>
        <div className='flex flex-row gap-2 overflow-x-auto w-full scrollbar-thin p-1'>
          <Select onValueChange={(value) => setSelectedFilter(value)}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select" />
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
