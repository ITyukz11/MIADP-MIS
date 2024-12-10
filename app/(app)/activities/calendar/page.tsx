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
import { FaRegCalendarAlt } from 'react-icons/fa';
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
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarSheet } from '@/components/calendar-of-activity/CalendarSheet';
import { formatDate, formatTime } from '@/components/table/data/activities/coa-columns';
import './calendarStyles.css';
import { FullscreenIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from '@/app/store/store';
import { fetchActivitiesData } from '@/app/store/activityAction';
import MajorOrIndividualDialog from '../major-or-individual-dialog';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { useActivitiesData } from '@/lib/calendar-of-activity/useActivitiesDataHook';

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

    // const { activities, loading, error } = useCalendarOfActivityContext();
    // const { activitiesData, activityLoading, activityError } = useSelector((state) => state.activity);
    const { activitiesData, activityError, activityLoading } = useActivitiesData()

    const { currentFilter } = useCalendarOfActivityFilter();

    const [filteredData, setFilteredData] = useState<Event[]>([]);

    const [fullScreenCalendar, setFullScreenCalendar] = useState(false)

    const [individualActivity, setIndividualActivity] = useState(false)
    const [planningActivityOpen, setPlanningActivityOpen] = useState(false)

    const handleSetIndividualActivity = (isIndividual: boolean) => {
        // Logic to handle setting individual activity state or any other actions
        setIndividualActivity(isIndividual)
    };

    const calendarRef = useRef<FullCalendar>(null);

    const formatEndDateToISOWithoutTimezone = (endDate: Date, startDate: Date) => {
        const dateEnd = new Date(endDate)
        const dateStart = new Date(startDate)
        const year = dateEnd.getFullYear();
        const month = String(dateEnd.getMonth() + 1).padStart(2, '0');
        const endDay = dateEnd.getDate();
        const startDay = dateStart.getDate();

        // If the end day is the same as the start day, no need to add a day
        // console.log("startDay endDay: ", startDay, endDay)
        if (startDay === endDay) {
            // console.log(`${year}-${month}-${String(endDay).padStart(2, '0')}`)
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

    const timeStartFormat = (time: string | null | undefined) => {
        if (!time) {
            return ""; // Return an empty string if isoString is null or undefined
        } else {
            return "T" + time;
        }
    }
    useEffect(() => {
        const fetchData = () => {
            try {
                const filteredActivities = activitiesData.filter((activity: any) => {
                    if (currentFilter?.typeOfActivity === 'WFP Activities') {
                        return !activity.individualActivity; // Only WFP Activities
                    } else if (currentFilter?.typeOfActivity === 'Individual Activities') {
                        return activity.individualActivity; // Only Individual Activities
                    }
                    return true; // If no specific type is selected, include all activities
                });
                const formattedData = filteredActivities.map((event: any) => {
                    // const startDate = new Date(event.dateFrom);
                    // const endDate = new Date(event.dateTo);
                    const startDate = event.dateFrom
                    const endDate = event.dateTo

                    return {
                        id: event.id,
                        title: event.activityTitle,
                        // start: formatStartDateToISOWithoutTimezone(startDate) + addingTimeEvent(event.timeStart), // Format date without timezone
                        // end: formatEndDateToISOWithoutTimezone(endDate, startDate) + addingTimeEvent(event.timeEnd),
                        start: startDate + timeStartFormat(event.timeStart),
                        end: formatEndDateToISOWithoutTimezone(endDate, startDate),
                        timeStart: event.timeStart,
                        timeEnd: event.timeEnd,
                        color: event.user.color, // Use user color
                        status: event.status,
                    };
                });

                const filteredUpcomingData = formattedData
                    .filter((event: any) => event.status === 'Upcoming')
                    .slice(0, 10); // Take the first 5 events

                const filteredOnGoingEvents = formattedData
                    .filter((event: any) => event.status === 'Ongoing')
                    .slice(0, 10); // Take the first 5 events

                setFilteredCoaData(formattedData);
                setFilteredUpcomingEvents(filteredUpcomingData)
                setFilteredOnGoingEvents(filteredOnGoingEvents)

            } catch (error) {
                console.error("Error fetching calendar of activity:", error);
            }
        };
        fetchData()
    }, [activitiesData, activityLoading, currentFilter])


    useEffect(() => {
        if (currentFilter?.filter === 'All') {
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
            const filteredActivities = activitiesData.filter((activity: any) => {
                if (currentFilter?.typeOfActivity === 'WFP Activities') {
                    return !activity.individualActivity; // Only WFP Activities
                } else if (currentFilter?.typeOfActivity === 'Individual Activities') {
                    return activity.individualActivity; // Only Individual Activities
                }
                return true; // If no specific type is selected, include all activities
            });

            const filtered = filteredActivities.filter((item: { user: { region: string | undefined; component: string | undefined; unit: string | undefined; }; }) =>
                item.user?.region === currentFilter?.filter ||
                item.user?.component === currentFilter?.filter ||
                item.user?.unit === currentFilter?.filter
            );

            const formattedData = filtered.map((event: any) => {
                // const startDate = new Date(event.dateFrom);
                // const endDate = new Date(event.dateTo);
                const startDate = event.dateFrom
                const endDate = event.dateTo

                return {
                    id: event.id,
                    title: event.activityTitle,
                    // start: formatStartDateToISOWithoutTimezone(startDate) + addingTimeEvent(event.timeStart), // Format date without timezone
                    // end: formatEndDateToISOWithoutTimezone(endDate, startDate) + addingTimeEvent(event.timeEnd),
                    start: startDate + timeStartFormat(event.timeStart),
                    end: formatEndDateToISOWithoutTimezone(endDate, startDate),
                    timeStart: event.timeStart,
                    timeEnd: event.timeEnd,
                    color: event.user.color, // Use user color
                    status: event.status,
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

        }
    }, [currentFilter, filteredCoaData]);

    const handleEventClick = (info: any) => {
        const activity = activitiesData.filter((activity: { id: any; }) => activity.id === info.event.id);
        setActivityData(activity)
        setCalendarSheetOpen(true)
    };

    const handleEventClick2 = (id: any) => {
        const activity = activitiesData.filter((activity: { id: any; }) => activity.id === id);
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
    const subtractOneDay = (dateString: string): string => {
        return dayjs(dateString).subtract(1, 'day').format('YYYY-MM-DD');
    };

    if (activityLoading) return (
        <div className='w-full flex justify-center'>
             <div className="flex flex-col py-2 md:flex-row gap-5 flex-wrap md:flex-nowrap overflow-hidden w-full max-w-[1800px]"
                style={{
                    ...(fullScreenCalendar ? { width: '100%' } : {})
                }}>
                    <div className='flex flex-col w-full md:w-1/4 gap-4 justify-start items-center'>
              <Card className='overflow-y-auto w-full md:max-h-[400px] rounded-xl scrollbar-thin scrollbar-track-rounded-full'>
                <CardContent className='p-8 flex flex-col gap-2'>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
            </div>
            <Card className="h-fit w-full min-h-[700px] mb-2 md:w-3/4 overflow-x-auto scrollbar-thin scrollbar-track-rounded-full"
                    style={fullScreenCalendar ? { width: '100%', height: '100%' } : undefined}>
                <CardContent className='p-8 flex flex-col gap-2'>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-96 w-full" />
                </CardContent>
            </Card>
            </div>
        </div>)
    if (activityError) return <Label className='text-destructive'>{activityError}</Label>
    return (
        <div className='w-full flex justify-center'>
            <div className="flex flex-col py-2 md:flex-row gap-5 flex-wrap md:flex-nowrap overflow-hidden w-full max-w-[1800px]"
                style={{
                    ...(fullScreenCalendar ? { width: '100%' } : {})
                }}>
                {!fullScreenCalendar &&
                    (<div className='flex flex-col w-full md:w-1/4 gap-4 justify-start items-center'>

                        <Card className='overflow-y-auto w-full md:max-h-[400px] rounded-xl scrollbar-thin scrollbar-track-rounded-full'>
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
                                {activityLoading ?
                                    <div className="space-y-2 mt-3 p-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div> :
                                    filteredUpcomingEvents.length > 0 ? filteredUpcomingEvents
                                        .slice(0, 10) // Limit to top 10 events
                                        .map((event: any) => {
                                            const startDate = formatDate(event.start);
                                            const endDate = formatDate(subtractOneDay(event.end));

                                            // Format the date and time

                                            // const startTimeString = timeStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                            const startTimeString = formatTime(event.timeStart);

                                            // const endTimeString = timeEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                            const endTimeString = formatTime(event.timeEnd)
                                            return (
                                                <div className='mt-3 hover:cursor-pointer z-10' key={event.id} onClick={() => handleEventClick2(event.id)}>
                                                    <div className="mb-2 flex gap-5">
                                                        {/* Colored circle icon */}
                                                        <svg width="10" height="10" className='flex items-start'>
                                                            <circle cx="5" cy="5" r="4" fill={event.color} />
                                                        </svg>
                                                        <div className='flex flex-col justify-center gap-1 w-full text-left text-xs'>
                                                            {/** - ${endDateString} ${endTimeString} */}
                                                            <div className='flex gap-3 flex-row flex-wrap'>
                                                                {/* <Label className="font-extralight">{`${startDateString}-${endDateString}`}</Label> */}
                                                                <Label className="font-extralight text-xs sm:text-sm">
                                                                    {startDate === endDate || startTimeString ? startDate : `${startDate} - ${endDate}`}
                                                                </Label>
                                                                <Label className="font-extralight text-xs sm:text-sm">{startTimeString ? `${startTimeString} - ${endTimeString}` : 'All Day'}</Label>
                                                            </div>

                                                            <Label className=' text-xs sm:text-sm'>{event.title}</Label>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                </div>
                                            );
                                        }) :
                                        <div className="flex justify-center mt-3 p-2 text-sm md:text-base">
                                            No upcoming event
                                        </div>

                                }


                            </CardContent>
                        </Card>
                        <Card className='overflow-y-auto w-full md:max-h-[400px] rounded-xl scrollbar-thin scrollbar-track-rounded-full'>
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
                                {activityLoading ?
                                    <div className="space-y-2 mt-3 p-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div> :
                                    filteredOnGoingEvents.length > 0 ? filteredOnGoingEvents
                                        .map((event: any) => {
                                            const startDate = formatDate(event.start);
                                            const endDate = formatDate(subtractOneDay(event.end));
                                            const minus1dayEndDate = formatDate(subtractOneDay(event.end));
                                            // const endDate = event.start == event.end ? formatDate(event.end):minus1dayEndDate

                                            const startTimeString = formatTime(event.timeStart);
                                            const endTimeString = formatTime(event.timeEnd)
                                            return (
                                                <div className='mt-3 hover:cursor-pointer z-10' key={event.id} onClick={() => handleEventClick2(event.id)}>
                                                    <div className="mb-2 flex gap-5">
                                                        {/* Colored circle icon */}
                                                        <svg width="10" height="10" className='flex items-start'>
                                                            <circle cx="5" cy="5" r="4" fill={event.color} />
                                                        </svg>
                                                        <div className='flex flex-col justify-center gap-3 w-full text-left'>
                                                            {/** - ${endDateString} ${endTimeString} */}
                                                            <div className='flex gap-3 flex-row flex-wrap'>
                                                                <Label className="font-extralight text-xs sm:text-sm">
                                                                    {startDate === endDate || startTimeString ? startDate : `${startDate} - ${endDate}`}
                                                                </Label>
                                                                <Label className="font-extralight text-xs sm:text-sm">{startTimeString ? `${startTimeString} - ${endTimeString}` : 'All Day'}</Label>
                                                            </div>
                                                            <Label className='text-xs md:text-sm'>{event.title}</Label>
                                                        </div>
                                                    </div>
                                                    <Separator />
                                                </div>
                                            );
                                        }) :
                                        <div className="flex justify-center mt-3 p-2 text-sm md:text-base">
                                            No ongoing event
                                        </div>
                                }

                            </CardContent>
                        </Card>
                    </div>)}
                <Card ref={cardRef}
                    className="h-fit w-full min-h-[700px] mb-2 md:w-3/4 overflow-x-auto scrollbar-thin scrollbar-track-rounded-full"
                    style={fullScreenCalendar ? { width: '100%', height: '100%' } : undefined}>
                    <div ref={cardRef} className='flex justify-end flex-row gap-2 p-1 px-5 pt-2'>
                        <Button
                            disabled={activityLoading}
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
                            locale={'en'}
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
                            // windowResize={handleWindowResize}
                            eventDisplay="block cursor-pointer"
                            plugins={[multiMonthPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView="multiMonthYear"
                            events={filteredData}
                            eventClick={handleEventClick}
                            eventClassNames={'cursor-pointer'}
                            selectable={true}
                        />
                    </CardContent>
                </Card>
            </div>
            <MajorOrIndividualDialog
                open={planningActivityOpen}
                setClose={() => setPlanningActivityOpen(!planningActivityOpen)}
                setCalendarFormOpen={() => setCalendarFormOpen(true)}
                setIndividualActivity={handleSetIndividualActivity}
            />

            <CalendarFormDialog open={calendarFormOpen}
                setClose={() => setCalendarFormOpen(false)}
                individualActivity_={individualActivity} />
            <CalendarSheet activityData={activityData} openSheet={calendarSheetOpen} closeCalendarSheet={() => setCalendarSheetOpen(!calendarSheetOpen)} />
        </div>
    );
};

export default page;
