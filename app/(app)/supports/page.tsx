'use client'
import React, { useEffect, useState } from 'react';
import { NavigationMenuDemo } from '@/components/navigation-menu';
import { fetchWPFActivityData } from '@/lib/supports/wpf-activity'; // Assuming WPFActivityType is exported from wpf-activity
import { columns2 } from '@/components/wpf-table';
import { DataTable } from '@/components/table/data-table';
import DialogWFPActivityForm from '@/components/dialog-wfp-activity-form';
import { Button } from '@/components/ui/button';
import { MdDelete, MdPrint, MdUpdate } from 'react-icons/md';


export default function Page() {
  const [WPFActivityData, setWPFActivityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data is available in localStorage
        const cachedDataString = localStorage.getItem("WPFActivityData");
        if (cachedDataString) {
          // If data is found in localStorage, parse it and set the state
          const cachedData = JSON.parse(cachedDataString);
          setWPFActivityData(cachedData);
        } else {
          // If no data found in localStorage, fetch from API and store in localStorage
          const data = await fetchWPFActivityData();
          setWPFActivityData(data);
          localStorage.setItem("WPFActivityData", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching WPF Activity data:", error);
      }
    };

    fetchData();
  }, []);
  // console.log("WPFACTIVITY: ",WPFActivityData)

  return (
    <div className='w-full relative'>
      <div>
        <NavigationMenuDemo />
      </div>
      <div className='mt-5 flex flex-col gap-4'>
        <div className='flex flex-row flex-wrap gap-2'>
        <DialogWFPActivityForm/>
    <Button variant={'outline'}><MdUpdate/> Update</Button>
    <Button variant={'outline'}><MdDelete/> Delete</Button>
    <Button variant={'outline'}><MdPrint/> Print</Button>
        </div>
        <DataTable columns={columns2} data={WPFActivityData} allowSelectRow={true}/>

      </div>
      {/* <DataTableDemo /> */}
    </div>
  );
}
