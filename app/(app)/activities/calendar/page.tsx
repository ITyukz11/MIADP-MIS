/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'

import { Button } from '@/components/ui/button';
import { FaKaaba, FaPlusCircle, FaRegCalendarAlt } from 'react-icons/fa';
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
import { useCalendarOfActivityContext } from '@/components/context/CalendarOfActivityContext';
import { CalendarSheet } from '@/components/calendar-of-activity/CalendarSheet';
import { formatDate, formatTime } from '@/components/table/data/activities/coa-columns';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ViewMyParticipatedSchedDialog } from '../view-participated-activity-dialog';
import './calendarStyles.css';
import { componentOptions, regionOptions, unitOptions } from '@/lib/data/filter';
import { useCurrentUser } from '@/components/context/CurrentUserContext';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { FullscreenIcon } from 'lucide-react';

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
    const { currentUser } = useCurrentUser();

    const [selectedFilter, setSelectedFilter] = useState(currentUser?.region);
    const [filteredData, setFilteredData] = useState<Event[]>([]);

    const [fullScreenCalendar, setFullScreenCalendar] = useState(false)

    const calendarRef = useRef<FullCalendar>(null);
    console.log("activities filteredCoaData: ", filteredCoaData)

    console.log("activities: ", activities)

    const formatDateToISOWithoutTimezone = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatStartDateToISOWithoutTimezone = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const formatEndDateToISOWithoutTimezone = (endDate: Date, startDate: Date) => {
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, '0');
        const endDay = endDate.getDate();
        const startDay = startDate.getDate();
    
        // If the end day is the same as the start day, no need to add a day
        if (startDay === endDay) {
            return `${year}-${month}-${String(endDay).padStart(2, '0')}`;
        }
    
        // Otherwise, add one day to the end day, and handle month/day boundaries
        const nextDay = new Date(endDate);
        nextDay.setDate(endDay + 1);
    
        const nextYear = nextDay.getFullYear();
        const nextMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
        const calculatedDay = String(nextDay.getDate()).padStart(2, '0');
    
        return `${nextYear}-${nextMonth}-${calculatedDay}`;
    };

    // Function to remove the date part and leave only the time
    const addingTimeEvent = (isoString: string | null | undefined) => {
        if (!isoString) {
            return ""; // Return an empty string if isoString is null or undefined
        }
        
        const addHoursToTime = (date: Date, hours: number) => {
            date.setHours(date.getHours() + hours);
            return date;
        };
        // Check if the isoString matches the time-only format (e.g., "09:00")
        const timeOnlyRegex = /^\d{2}:\d{2}$/;
        if (timeOnlyRegex.test(isoString)) {
            const [hours, minutes] = isoString.split(':').map(Number);
            let date = new Date();
            date.setHours(hours, minutes, 0, 0);
            date = addHoursToTime(date, 16);
            const newHours = String(date.getHours()).padStart(2, '0');
            const newMinutes = String(date.getMinutes()).padStart(2, '0');
            return `T${newHours}:${newMinutes}:00.000Z`; // Convert to full time format with added 8 hours
        }
    
        // Otherwise, assume it's an ISO date string and extract the time part
        return 'T' + isoString.split('T')[1];
    };
    

    useEffect(() => {
        const fetchData = () => {
            try {

                const formattedData = activities.map((event: any) => {
                    const startDate = new Date(event.dateFrom);
                    const endDate = new Date(event.dateTo);

                    return {
                        id: event.id,
                        title: event.activityTitle,
                        start: formatStartDateToISOWithoutTimezone(startDate) + addingTimeEvent(event.timeStart), // Format date without timezone
                        end: formatEndDateToISOWithoutTimezone(endDate, startDate) + addingTimeEvent(event.timeEnd),
                        timeStart: event.timeStart,
                        timeEnd: event.timeEnd,
                        color: event.user.color, // Use user color
                        status: event.status
                    };
                });

                console.log("formattedData: ", formattedData)

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
            console.log("filteredUpcomingData: ",filteredUpcomingData)

            } catch (error) {
                console.error("Error fetching calendar of activity:", error);
            }
        };
        fetchData()
    }, [activities, loading])

    console.log("filteredData: ", filteredData)

    useEffect(() => {
        if (selectedFilter === 'All') {
            setFilteredData(filteredCoaData);

            const filteredUpcomingData = filteredCoaData
                .filter((event: any) => event.status === 'Upcoming')
                .slice(0, 10); // Take the first 5 events

            const filteredOnGoingEvents = filteredCoaData
                .filter((event: any) => event.status === 'Ongoing')
                .slice(0, 10); // Take the first 5 events

            setFilteredUpcomingEvents(filteredUpcomingData)
            setFilteredOnGoingEvents(filteredOnGoingEvents)
        } else {
            const filtered = activities.filter(item =>
                item.user?.region === selectedFilter ||
                item.user?.component === selectedFilter ||
                item.user?.unit === selectedFilter
            );

            const formattedData = filtered.map((event: any) => {
                const startDate = new Date(event.dateFrom);
                const endDate = new Date(event.dateTo);

                return {
                    id: event.id,
                    title: event.activityTitle,
                    start: formatStartDateToISOWithoutTimezone(startDate) + addingTimeEvent(event.timeStart), // Format date without timezone
                    end: formatEndDateToISOWithoutTimezone(endDate, startDate) + addingTimeEvent(event.timeEnd),
                    timeStart: event.timeStart,
                    timeEnd: event.timeEnd,
                    color: event.user.color, // Use user color
                    status: event.status
                };
            });

            const filteredUpcomingData = formattedData
                .filter((event: any) => event.status === 'Upcoming')
                .slice(0, 10); // Take the first 5 events

            const filteredOnGoingEvents = formattedData
                .filter((event: any) => event.status === 'Ongoing')
                .slice(0, 10); // Take the first 5 events

            setFilteredData(formattedData);
            setFilteredUpcomingEvents(filteredUpcomingData)
            setFilteredOnGoingEvents(filteredOnGoingEvents)

            console.log("filteredUpcomingData: ",filteredUpcomingData)
        }
    }, [selectedFilter, filteredCoaData]);

    const events = [
        // Replace this with your actual list of events
        { id: '1', title: 'Orientation cum Meeting with NCIP and MIADP Staff', start: '2024-06-01T11:00:00+09:00', end: '2024-06-03T11:00:00+09:00', color: '#ff0000' },
        { id: '2', title: 'PSO-RPCO 1st Quarter Assessment, Davao City', start: '2024-06-05', end: '2024-06-07T00:00:01', color: '#013220' },
        {
            id: '3',
            title: 'Drone Pilot Training with Introduction to Aerial Mapping using UAVs',
            start: '2024-06-02T10:00:00', // Include time in ISO 8601 format
            end: '2024-06-02T18:00:00',   // Include time in ISO 8601 format
            color: '#0000ff'
        },
        { id: '4', title: 'Event 1', start: '2024-06-20', end: '2024-06-20', color: '#ff0000' },
        { id: '5', title: 'Event 2', start: '2024-06-21', end: '2024-06-07', color: '#013220' },
        { id: '6', title: 'Event 3', start: '2024-06-26', end: '2024-06-12', color: '#0000ff' },
        { id: '7', title: 'Event 1', start: '2024-06-30', end: '2024-06-20', color: '#ff0000' },
        { id: '8', title: 'SDS Orientation', start: '2024-06-05', end: '2024-06-07', color: '#013220' },
        { id: '9', title: 'Training of Trainers (TOT) - Business Plan Preparation (Modules 1 and 2) (RPCO-LGU-NCIP)', start: '2024-06-07', end: '2024-06-12', color: '#0000ff' },
    ];

    const handleEventClick = (info: any) => {
        const activity = activities.filter(activity => activity.id === info.event.id);
        setActivityData(activity)
        setCalendarSheetOpen(true)
    };

    const handleEventClick2 = (id: any) => {
        const activity = activities.filter(activity => activity.id === id);
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

    useEffect(() => {
        handleWindowResize()
    }, [])

    const handleWindowResize = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (window.innerWidth < 768) {
            calendarApi?.changeView('timeGridDay');
        } else {
            calendarApi?.changeView('dayGridMonth');
        }
    };

    const cardRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState(0);

    const updateCardHeight = () => {
        if (cardRef.current && window.innerWidth >= 768) {
            setCardHeight(cardRef.current.offsetHeight);
        } else {
            setCardHeight(0); // Reset height for small screens
        }
    };

    useLayoutEffect(() => {
        updateCardHeight(); // Initial call

        window.addEventListener('resize', updateCardHeight); // Update on resize
        window.addEventListener('orientationchange', updateCardHeight); // Update on orientation change

        return () => {
            window.removeEventListener('resize', updateCardHeight); // Cleanup on unmount
            window.removeEventListener('orientationchange', updateCardHeight); // Cleanup on unmount
        };
    }, []); // Empty dependency array to only run on mount and unmount

    useEffect(() => {
        updateCardHeight(); // Update on filteredUpcomingEvents change
    }, [filteredUpcomingEvents]);

    const toggleFullScreen = () => {
        setFullScreenCalendar(!fullScreenCalendar);
        if (cardRef.current) {
            cardRef.current.focus();
        }
    };

    return (
        <div className='px-8 mx-auto w-full relative'>
            <div className="flex flex-col py-2 md:flex-row gap-2 flex-wrap md:flex-nowrap overflow-hidden justify-center"
                style={{
                    ...{ height: cardHeight ? `${cardHeight}px` : 'auto' },
                    ...(fullScreenCalendar ? { width: '100%', height: '100%' } : {})
                }}>
                {!fullScreenCalendar &&
                    (<div className='flex flex-col w-full md:w-1/4 gap-2 justify-center'>
                        <Card>
                            <CardHeader>
                                <Button
                                    variant="default"
                                    className='flex flex-row items-center gap-1 justify-center text-xs lg:text-sm'
                                    onClick={() => setCalendarFormOpen(true)}><FaPlusCircle className='shrink-0' /> Create new activity</Button>
                                <ViewMySchedDialog />
                                <ViewMyParticipatedSchedDialog />
                            </CardHeader>
                        </Card>
                        <Card className='overflow-y-auto md:h-full rounded-xl scrollbar-thin scrollbar-track-rounded-full'>
                            <CardHeader className="font-bold gap-2 sticky top-0 p-3 z-10 border-b bg-white dark:bg-gray-800">
                                <CardTitle className="flex flex-row items-center justify-start gap-10">
                                    <FaRegCalendarAlt />
                                    <div className='flex flex-row gap-2 items-center'>
                                        <Label className='text-sm md:text-base font-semibold'>{filteredUpcomingEvents.slice(0, 10).length} Upcoming Event{filteredUpcomingEvents.length > 1 ? 's' : ''}</Label>
                                        {filteredUpcomingEvents.length > 10 && (
                                            <Label className='text-xs text-green-400'>
                                                +{filteredUpcomingEvents.length - 10} more
                                            </Label>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent>
                                {/* Display the top 5 nearest events */}
                                {loading ?
                                    <div className="space-y-2 mt-3 p-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div> :
                                    filteredUpcomingEvents.length > 0 ? filteredUpcomingEvents
                                        .slice(0, 10) // Limit to top 10 events
                                        .map((event: any) => {
                                            const startDate = new Date(event.start);
                                            const endDate = new Date(event.end);
                                            const timeStart = new Date(event.timeStart)
                                            const timeEnd = new Date(event.timeEnd)
                                                
                                            // Format the date and time
                                            const startDateString = startDate.toLocaleDateString(); // Get date string
                                            // const startTimeString = timeStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                            const startTimeString = formatTime(event.timeStart);
                                            const endDateString = endDate.toLocaleDateString(); // Get date string
                                            // const endTimeString = timeEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                            const endTimeString = formatTime(event.timeEnd)
                                            return (
                                                <div className='mt-3 hover:cursor-pointer z-10' key={event.id} onClick={() => handleEventClick2(event.id)}>
                                                    <div className="mb-2 flex gap-5">
                                                        {/* Colored circle icon */}
                                                        <svg width="10" height="10" className='flex items-start'>
                                                            <circle cx="5" cy="5" r="4" fill={event.color} />
                                                        </svg>
                                                        <div className='flex flex-col justify-center gap-3 w-full text-left text-xs'>
                                                            {/** - ${endDateString} ${endTimeString} */}
                                                            <div className='flex gap-3 flex-row flex-wrap'>
                                                                {/* <Label className="font-extralight">{`${startDateString}-${endDateString}`}</Label> */}
                                                                <Label className="font-extralight">{`${formatDate(event.start)}-${formatDate(event.end)}`}</Label>
                                                                <Label className="font-extralight">{startTimeString ? startTimeString : '-All Day'}-{endTimeString && endTimeString}</Label>
                                                            </div>

                                                            <Label>{event.title}</Label>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                </div>
                                            );
                                        }) :
                                        <div className="flex justify-center mt-3 p-2">
                                            No upcoming event
                                        </div>

                                }


                            </CardContent>
                        </Card>
                        <Card className='overflow-y-auto md:h-full rounded-xl scrollbar-thin scrollbar-track-rounded-full'>
                            <CardHeader className="font-bold gap-2 p-3 sticky top-0 z-10 border-b bg-white dark:bg-gray-800">
                                <CardTitle className="flex flex-row items-center justify-start gap-10">
                                    <FaRegCalendarAlt />
                                    <div className='flex flex-row gap-2 items-center'>
                                        <Label className='text-sm md:text-base font-semibold'>{filteredOnGoingEvents.slice(0, 10).length} Ongoing Event{filteredOnGoingEvents.length > 1 ? 's' : ''}</Label>
                                        {filteredOnGoingEvents.length > 10 && (
                                            <Label className='text-xs text-green-400'>
                                                +{filteredOnGoingEvents.length - 10} more
                                            </Label>
                                        )}
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent>
                                {/* Display the top 5 nearest events */}
                                {loading ?
                                    <div className="space-y-2 mt-3 p-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div> :
                                    filteredOnGoingEvents.length > 0 ? filteredOnGoingEvents
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
                                                <div className='mt-3 hover:cursor-pointer z-10' key={event.id} onClick={() => handleEventClick2(event.id)}>
                                                    <div className="mb-2 flex gap-5">
                                                        {/* Colored circle icon */}
                                                        <svg width="10" height="10" className='flex items-start'>
                                                            <circle cx="5" cy="5" r="4" fill={event.color} />
                                                        </svg>
                                                        <div className='flex flex-col justify-center gap-3 w-full text-left'>
                                                            {/** - ${endDateString} ${endTimeString} */}
                                                            <Label className="font-extralight">{`${startDateString}-${endDateString}`}</Label>
                                                            <Label className='text-xs md:text-sm'>{event.title}</Label>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                </div>
                                            );
                                        }) :
                                        <div className="flex justify-center mt-3 p-2 text-sm md:text-base">
                                            No going event
                                        </div>
                                }

                            </CardContent>
                        </Card>
                    </div>)}
                <Card ref={cardRef}
                    className="h-full min-h-screen mb-2 w-full md:w-3/4 overflow-x-auto scrollbar-thin scrollbar-track-rounded-full"
                    style={fullScreenCalendar ? { width: '100%', height: '100%' } : undefined}>
                    <div ref={cardRef} className='flex justify-between flex-row gap-2 p-1 px-5 pt-2'>
                        <Select onValueChange={(value) => setSelectedFilter(value)} disabled={loading}>
                            <SelectTrigger className="w-fit">
                                <SelectValue placeholder={currentUser?.region ? currentUser?.region : "Filter"} />
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
                        <Button
                            disabled={loading}
                            onClick={toggleFullScreen}
                            variant='link'
                            className='flex-row justify-center gap-1 items-center hidden md:flex'
                        >
                            {fullScreenCalendar ? 'Minimize' : 'Fullscreen'}
                            <FullscreenIcon width={20} height={20} />
                        </Button>
                    </div>
                    <CardContent>
                        <FullCalendar
                            ref={calendarRef}
                            headerToolbar={{
                                left: 'today prev,next',
                                center: 'title',
                                right: 'list,timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear',
                            }}
                            displayEventTime={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            }}
                            windowResize={handleWindowResize}
                            eventDisplay="block cursor-pointer"
                            plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView="dayGridMonth"
                            events={filteredData}
                            eventClick={handleEventClick}
                            eventClassNames={'cursor-pointer'}
                            selectable={true}
                        />
                    </CardContent>
                </Card>
            </div>
            <CalendarFormDialog open={calendarFormOpen}
                setClose={() => setCalendarFormOpen(false)} />
            <CalendarSheet activityData={activityData} openSheet={calendarSheetOpen} closeCalendarSheet={() => setCalendarSheetOpen(!calendarSheetOpen)} />
        </div>
    );
};

export default page;
