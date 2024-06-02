/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/table/data/activities/coa-columns'
import { coaDataExample } from '@/components/table/data/activities/data-example'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FilterMenus } from './filtermenus'
import { fetchCalendarOfActivity } from '@/lib/calendar-of-activity/fetch-calendar-of-activity'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Skeleton } from '@/components/ui/skeleton'
import { useCalendarOfActivityContext } from '@/components/CalendarOfActivityContext'

type Props = {}

const page = (props: Props) => {
  const [coaData, setCoaData] = useState<any[]>([]);

  const { activities, loading, error } = useCalendarOfActivityContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCoaData(activities);
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };
    fetchData();
  }, [activities, loading]);


  return (
    <div className='container relative'>
      <div className='flex flex-col gap-2 flex-wrap w-full'>
        <div className='flex flex-row gap-2 overflow-x-auto w-full scrollbar-thin mb-2'>
          {FilterMenus.map((menu, index) => (
            <Button key={index} className='cursor-pointer whitespace-nowrap p-2 mb-2' variant={menu.variant == 'default' ? 'default' : 'outline'}>
              {menu.text}
            </Button>
          ))}
        </div>

        {coaData.length > 0 ? (
          <div className='w-full overflow-x-auto scrollbar-thin'>
            <DataTable data={coaData} columns={columns} />
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        )}

      </div>
    </div>

  )
}

export default page