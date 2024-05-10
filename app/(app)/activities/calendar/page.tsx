/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useState } from 'react';
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

const page = () => {
    const router = useRouter();
    const [view, setView] = useState<string>('dayGridMonth'); // default view

    const events = [
        // Replace this with your actual list of events
        { id: '1', title: 'Orientation cum Meeting with NCIP and MIADP Staff', start: '2024-05-01T11:00:00+09:00', end: '2024-05-04', color: '#ff0000' },
        { id: '2', title: 'PSO-RPCO 1st Quarter Assessment, Davao City', start: '2024-05-05', end: '2024-05-07', color: '#013220' },
        {
            id: '3',
            title: 'Drone Pilot Training with Introduction to Aerial Mapping using UAVs',
            start: '2024-05-02T10:00:00', // Include time in ISO 8601 format
            end: '2024-05-02T18:00:00',   // Include time in ISO 8601 format
            color: '#0000ff'
        },
        { id: '4', title: 'Event 1', start: '2024-05-20', end: '2024-05-20', color: '#ff0000' },
        { id: '5', title: 'Event 2', start: '2024-05-21', end: '2024-05-07', color: '#013220' },
        { id: '6', title: 'Event 3', start: '2024-05-26', end: '2024-05-12', color: '#0000ff' },
        { id: '7', title: 'Event 1', start: '2024-05-30', end: '2024-05-20', color: '#ff0000' },
        { id: '8', title: 'SDS Orientation', start: '2024-05-05', end: '2024-05-07', color: '#013220' },
        { id: '9', title: 'Training of Trainers (TOT) - Business Plan Preparation (Modules 1 and 2) (RPCO-LGU-NCIP)', start: '2024-05-07', end: '2024-05-12', color: '#0000ff' },
    ];

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
            <div className="flex gap-2">
                <div className='flex flex-col w-1/4 gap-2'>
                    <Card>
                        <CardHeader>
                        <CalendarFormDialog/>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className=' font-bold gap-2'>
                            <CardTitle className='flex flex-row items-center justify-start gap-10'> <FaRegCalendarAlt /> Upcoming Events</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            {/* Display the top 5 nearest events */}
                            {events
                                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()) // Sort events by start date
                                .slice(0, 5) // Take the first 5 events
                                .map((event) => {
                                    const startDate = new Date(event.start);
                                    const endDate = new Date(event.end);

                                    // Format the date and time
                                    const startDateString = startDate.toLocaleDateString(); // Get date string
                                    const startTimeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds
                                    const endDateString = endDate.toLocaleDateString(); // Get date string
                                    const endTimeString = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get time string without seconds

                                    return (
                                        <div className='mt-3' key={event.id}>
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
                                })}
                        </CardContent>
                    </Card>
                </div>
                <Card className="w-3/4">
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
                            }
                            }
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                            initialView={'dayGridMonth'}
                            events={events}
                            eventClick={handleEventClick}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default page;
