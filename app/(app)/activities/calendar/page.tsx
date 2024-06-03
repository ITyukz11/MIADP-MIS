/* eslint-disable react-hooks/exhaustive-deps */
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
import CalendarFormDialog from '../calendar-form-dialog';
import { useRouter } from 'next/navigation';
import { ViewMySchedDialog } from '../view-my-sched-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useCalendarOfActivityContext } from '@/components/CalendarOfActivityContext';
import { CalendarSheet } from '@/components/calendar-of-activity/CalendarSheet';

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
    const [calendarSheetOpen, setCalendarSheetOpen] = useState(false)
    const [activityData, setActivityData] = useState<any[]>([]);
    // const [coaData, setCoaData] = useState({})
    const [filteredCoaData, setFilteredCoaData] = useState<Event[]>([]);
    const [filteredUpcomingEvents, setFilteredUpcomingEvents] = useState<Event[]>([]);
    const [filteredOnGoingEvents, setFilteredOnGoingEvents] = useState<Event[]>([]);
    const { activities, loading, error } = useCalendarOfActivityContext();

    console.log("activities: ", activities)


    useEffect(() => {
        const fetchData = () => {
            try {
                const formatDateToISOWithoutTimezone = (date: Date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
    
                const formattedData = activities.map((event: any) => {
                    const startDate = new Date(event.dateFrom);
                    const endDate = new Date(event.dateTo);
    
                    return {
                        id: event.id,
                        title: event.activityTitle,
                        start: formatDateToISOWithoutTimezone(startDate), // Format date without timezone
                        end: formatDateToISOWithoutTimezone(endDate),
                        timeStart: event.timeStart,
                        timeEnd: event.timeEnd,
                        color: event.user.color, // Use user color
                        status: event.status
                    };
                });
    
                console.log(formattedData)
    
                const filteredUpcomingData = formattedData
                    .filter((event: any) => event.status === 'Upcoming')
                    .slice(0, 10); // Take the first 5 events
                
                const filteredOnGoingEvents = formattedData
                .filter((event: any) => event.status === 'Ongoing')
                .slice(0, 10); // Take the first 5 events

                setFilteredCoaData(formattedData);
                setFilteredUpcomingEvents(filteredUpcomingData)
                setFilteredOnGoingEvents(filteredOnGoingEvents)
                console.log("filteredCoaData:", filteredCoaData)
            } catch (error) {
                console.error("Error fetching calendar of activity:", error);
            }
        };
        fetchData()
    }, [activities, loading])

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
        const activity = activities.filter(activity => activity.id === info.event.id);
        setActivityData(activity)
        setCalendarSheetOpen(true)
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
                <div className='flex flex-col w-full md:w-1/4 gap-2'>
                    <Card>
                        <CardHeader>
                            <Button
                                variant="default"
                                className='flex flex-row items-center gap-1 justify-center'
                                onClick={() => setCalendarFormOpen(true)}><FaPlusCircle /> Create new activity</Button>
                            <ViewMySchedDialog />
                        </CardHeader>
                    </Card>
                    <Card className=' overflow-hidden'>
                        <CardHeader className=' font-bold gap-2'>
                            <CardTitle className='flex flex-row items-center justify-start gap-10'> <FaRegCalendarAlt /> {filteredUpcomingEvents.length} Upcoming Event{filteredUpcomingEvents.length>1 ? 's':''}</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            {/* Display the top 5 nearest events */}
                            {filteredUpcomingEvents.length > 0 ? filteredUpcomingEvents
                                .map((event: any) => {
                                    const startDate = new Date(event.start);
                                    const endDate = new Date(event.end);
                                    const timeStart = new Date(event.timeStart)
                                    const timeEnd = new Date(event.timeEnd)

                                    // Format the date and time
                                    const startDateString = startDate.toLocaleDateString(); // Get date string
                                    const startTimeString = timeStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                    const endDateString = endDate.toLocaleDateString(); // Get date string
                                    const endTimeString = timeEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds

                                    return (
                                        <div className='mt-3 hover:cursor-pointer z-10' key={event.id}>
                                            <div className="mb-2 flex gap-5">
                                                {/* Colored circle icon */}
                                                <svg width="10" height="10" className='flex items-start'>
                                                    <circle cx="5" cy="5" r="4" fill={event.color} />
                                                </svg>
                                                <div className='flex flex-col justify-center gap-3 w-full text-left'>
                                                    {/** - ${endDateString} ${endTimeString} */}
                                                    <Label className="font-extralight">{`${startDateString}-${startTimeString}`}</Label>
                                                    <Label>{event.title}</Label>
                                                </div>
                                            </div>
                                            <Separator />
                                        </div>
                                    );
                                }) :
                                <div className="space-y-2 mt-3 p-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            }

                        </CardContent>
                    </Card>
                    <Card className=' overflow-hidden'>
                        <CardHeader className=' font-bold gap-2'>
                            <CardTitle className='flex flex-row items-center justify-start gap-10'> <FaRegCalendarAlt /> {filteredOnGoingEvents.length} Ongoing Event{filteredOnGoingEvents.length>1 ? 's':''}</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            {/* Display the top 5 nearest events */}
                            {filteredOnGoingEvents.length > 0 ? filteredOnGoingEvents
                                .map((event: any) => {
                                    const startDate = new Date(event.start);
                                    const endDate = new Date(event.end);
                                    const timeStart = new Date(event.timeStart)
                                    const timeEnd = new Date(event.timeEnd)

                                    // Format the date and time
                                    const startDateString = startDate.toLocaleDateString(); // Get date string
                                    const startTimeString = timeStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                    const endDateString = endDate.toLocaleDateString(); // Get date string
                                    const endTimeString = timeEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds

                                    return (
                                        <div className='mt-3 hover:cursor-pointer z-10' key={event.id}>
                                            <div className="mb-2 flex gap-5">
                                                {/* Colored circle icon */}
                                                <svg width="10" height="10" className='flex items-start'>
                                                    <circle cx="5" cy="5" r="4" fill={event.color} />
                                                </svg>
                                                <div className='flex flex-col justify-center gap-3 w-full text-left'>
                                                    {/** - ${endDateString} ${endTimeString} */}
                                                    <Label className="font-extralight">{`${startDateString}-${endDateString}`}</Label>
                                                    <Label>{event.title}</Label>
                                                </div>
                                            </div>
                                            <Separator />
                                        </div>
                                    );
                                }) :
                                <div className="space-y-2 mt-3 p-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            }

                        </CardContent>
                    </Card>
                </div>
                <Card className="w-fit md:w-3/4 overflow-x-auto scrollbar-thin scrollbar-track-rounded-full ">
                    <CardHeader className='flex flex-row justify-end gap-2 items-center'>
                        <div className='flex flex-row gap-2 overflow-x-auto scrollbar-thin scrollbar-track-rounded-full w-full scroll scroll-me-px'>
                            {/* {FilterMenus.map((menu, index) => (
                                <Button key={index} className='cursor-pointer whitespace-nowrap p-2 mb-2' variant={menu.variant == 'default' ? 'default' : 'outline'}>
                                    {menu.text}
                                </Button>
                            ))} */}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FullCalendar
                            
                            headerToolbar={{
                                left: 'today prev,next',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,list',

                            }}
                            displayEventTime={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            eventDisplay='block cursor-pointer' // Set the eventDisplay property to 'block'
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView={'dayGridMonth'}
                            events={filteredCoaData}
                            eventClick={handleEventClick}

                        />

                    </CardContent>
                </Card>
            </div>
            <CalendarFormDialog open={calendarFormOpen}
                setClose={() => setCalendarFormOpen(false)} />
            <CalendarSheet activityData={activityData} openSheet={calendarSheetOpen} closeCalendarSheet={()=> setCalendarSheetOpen(!calendarSheetOpen)}/>
        </div>
    );
};

export default page;
