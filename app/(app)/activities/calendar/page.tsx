/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import { Button } from '@/components/ui/button';
import { FaPlusCircle, FaRegCalendarAlt } from 'react-icons/fa';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { FilterMenus } from '../filtermenus';
import CalendarFormDialog from '../calendar-form-dialog';
import { useRouter } from 'next/navigation';
import { ViewMySchedDialog } from '../view-my-sched-dialog';
import { fetchCalendarOfActivity } from '@/lib/calendar-of-activity/fetch-calendar-of-activity';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
    id: string;
    title: string;
    start: string; // Assuming start date is a string in ISO 8601 format
    end: string; // Assuming end date is a string in ISO 8601 format
    color: string;
    // Add other properties if needed
}

const page = () => {
    const router = useRouter();
    const [view, setView] = useState<string>('dayGridMonth'); // default view
    const [calendarFormOpen, setCalendarFormOpen] = useState(false)
    const [coaData, setCoaData] = useState({})
    const [filteredCoaData, setFilteredCoaData] = useState<Event[]>([]);

    const [refreshCalendarData, setRefreshCalendarData] = useState(false);


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCalendarOfActivity();
                const formattedData = data.map((event: { id: any; activityTitle: any; dateRange: any; dateFrom: any; color: any }) => {
                    let start: string;
                    let end: string;

                    // Check if dateRange has value
                    if (event.dateRange && event.dateRange.length > 0) {
                        // Assuming dateRange is an array with only one element
                        const range = event.dateRange[0];

                        // Format startDate and endDate into 'yyyy-mm-dd' format
                        start = range.startDate.replace(/\//g, '-');
                        end = range.endDate.replace(/\//g, '-');
                    } else {
                        // If dateRange is empty, use dateFrom as both start and end
                        start = new Date(event.dateFrom).toISOString().slice(0, 10);
                        end = start; // Assuming end date is same as start date for non-allDay events
                    }

                    return {
                        id: event.id,
                        title: event.activityTitle,
                        start: start,
                        end: end,
                        color: event.color // You can set color based on status or any other criteria
                    };
                });

                setFilteredCoaData(formattedData);
            } catch (error) {
                console.error("Error fetching calendar of activity:", error);
            }
        };

        // Trigger the effect whenever refreshData changes
        fetchData();
    }, [refreshCalendarData]); // Pass refreshData as a dependency to the useEffect



    console.log("coaData: ", coaData)
    console.log("filteredcoaData: ", filteredCoaData)
    // const events = [
    //     // Replace this with your actual list of events
    //     { id: '1', title: 'Orientation cum Meeting with NCIP and MIADP Staff', start: '2024-05-01T11:00:00+09:00', end: '2024-05-04', color: '#ff0000' },
    //     { id: '2', title: 'PSO-RPCO 1st Quarter Assessment, Davao City', start: '2024-05-05', end: '2024-05-07', color: '#013220' },
    //     {
    //         id: '3',
    //         title: 'Drone Pilot Training with Introduction to Aerial Mapping using UAVs',
    //         start: '2024-05-02T10:00:00', // Include time in ISO 8601 format
    //         end: '2024-05-02T18:00:00',   // Include time in ISO 8601 format
    //         color: '#0000ff'
    //     },
    //     { id: '4', title: 'Event 1', start: '2024-05-20', end: '2024-05-20', color: '#ff0000' },
    //     { id: '5', title: 'Event 2', start: '2024-05-21', end: '2024-05-07', color: '#013220' },
    //     { id: '6', title: 'Event 3', start: '2024-05-26', end: '2024-05-12', color: '#0000ff' },
    //     { id: '7', title: 'Event 1', start: '2024-05-30', end: '2024-05-20', color: '#ff0000' },
    //     { id: '8', title: 'SDS Orientation', start: '2024-05-05', end: '2024-05-07', color: '#013220' },
    //     { id: '9', title: 'Training of Trainers (TOT) - Business Plan Preparation (Modules 1 and 2) (RPCO-LGU-NCIP)', start: '2024-05-07', end: '2024-05-12', color: '#0000ff' },
    // ];

    const handleEventClick = (info: any) => {
        // Redirect to event details page
        router.push(`/event/${info.event.id}`);
    };

    const handleCreateNewActivity = () => {
        // Redirect to create activity page
        router.push('/create-activity');
    };

    const handleViewChange = (newView: string) => {
        setView(newView);
    };

    return (
        <div className='container relative'>
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <div className='flex flex-col md:w-1/4 gap-2'>
                    <Card>
                        <CardHeader>
                            <Button
                                variant="default"
                                className='flex flex-row items-center gap-1 justify-center'
                                onClick={() => setCalendarFormOpen(true)}><FaPlusCircle /> Create new activity</Button>
                            <ViewMySchedDialog />
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className=' font-bold gap-2'>
                            <CardTitle className='flex flex-row items-center justify-start gap-10'> <FaRegCalendarAlt /> Upcoming Events</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            {/* Display the top 5 nearest events */}
                            {filteredCoaData.length>0 ? filteredCoaData
                                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // Sort events by start date
                                .slice(0, 5) // Take the first 5 events
                                .map((event: { start: string | number | Date; end: string | number | Date; id: React.Key | null | undefined; color: string | undefined; title: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => {
                                    const startDate = new Date(event.start);
                                    const endDate = new Date(event.end);

                                    // Format the date and time
                                    const startDateString = startDate.toLocaleDateString(); // Get date string
                                    const startTimeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                    const endDateString = endDate.toLocaleDateString(); // Get date string
                                    const endTimeString = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds

                                    return (
                                        <div className='mt-3 hover:cursor-pointer z-10' key={event.id}>
                                            <div className="mb-2 flex gap-5">
                                                {/* Colored circle icon */}
                                                <svg width="10" height="10" className='flex items-start'>
                                                    <circle cx="5" cy="5" r="4" fill={event.color} />
                                                </svg>
                                                <div className='flex flex-col justify-center gap-3 w-full text-left'>
                                                    {/** - ${endDateString} ${endTimeString} */}
                                                    <Label className="font-extralight">{`${startDateString} ${startTimeString}`}</Label>
                                                    <Label>{event.title}</Label>
                                                </div>
                                            </div>
                                            <Separator />
                                        </div>
                                    );
                                }) : 
                                <div className="space-y-2 mt-3">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                           }
                        </CardContent>

                    </Card>
                </div>
                <Card className="w-fit md:w-3/4 overflow-x-auto">
                    <CardHeader className='flex flex-row justify-end gap-2 items-center'>
                        <div className='flex flex-row gap-2 overflow-x-auto w-full scroll scroll-me-px'>
                            {FilterMenus.map((menu, index) => (
                                <Button key={index} className='cursor-pointer whitespace-nowrap p-2 mb-2' variant={menu.variant == 'default' ? 'default' : 'outline'}>
                                    {menu.text}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FullCalendar
                            headerToolbar={{
                                left: 'today prev,next',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,list'
                            }}
                            displayEventTime={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            eventDisplay='block' // Set the eventDisplay property to 'block'
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView={'dayGridMonth'}
                            events={filteredCoaData}
                            eventClick={handleEventClick}
                        />

                    </CardContent>
                </Card>
            </div>
            <CalendarFormDialog open={calendarFormOpen} setClose={() => setCalendarFormOpen(false)} refreshCalendar={()=> setRefreshCalendarData(prevState => !prevState)}/>
        </div>
    );
};

export default page;
