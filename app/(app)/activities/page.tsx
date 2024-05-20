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

type Props = {}

const page = (props: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [coaData, setCoaData] = useState<any[]>([]);
  // Effect to fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(data)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCalendarOfActivity();
        setCoaData(data);
      } catch (error) {
        console.error("Error fetching calendar of activity:", error);
      }
    };

    fetchData();
  }, []);

  console.log("coaData: ", coaData)

  return (
    <div className='container relative'>
      <div className='flex flex-col gap-2 flex-wrap w-full'>
        <div className='flex flex-row gap-2 overflow-x-auto w-full scroll scroll-me-px mb-2'>
          {FilterMenus.map((menu, index) => (
            <Button key={index} className='cursor-pointer whitespace-nowrap p-2 mb-2' variant={menu.variant == 'default' ? 'default' : 'outline'}>
              {menu.text}
            </Button>
          ))}
        </div>

        {coaData.length > 0 ? (
          <div className='w-full overflow-x-auto'>
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