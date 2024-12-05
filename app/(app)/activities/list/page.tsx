'use client';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { formatDate, getStatusColor } from '@/components/table/data/activities/coa-columns';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useActivitiesData } from '@/lib/calendar-of-activity/useActivitiesDataHook';
import { statusOptions } from '@/lib/data/filter';
import { cn } from '@/lib/utils';
import { Activity } from '@/types/calendar-of-activity/calendar-of-activity';
import { formatDateLong } from '@/utils/dateFormat';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Page: React.FC = () => {
    const { activitiesData, activityError, activityLoading } = useActivitiesData();
    const [filteredData, setFilteredData] = useState<Activity[]>([]);
    const [visibleData, setVisibleData] = useState<Activity[]>([]);
    const [itemsToShow, setItemsToShow] = useState(5);

    const { currentFilter } = useCalendarOfActivityFilter();

    useEffect(() => {
        if (!activitiesData) return;

        const filteredActivities = activitiesData.filter((activity: any) => {
            if (currentFilter?.typeOfActivity === 'WFP Activities') {
                return !activity.individualActivity;
            } else if (currentFilter?.typeOfActivity === 'Individual Activities') {
                return activity.individualActivity;
            }
            return true;
        });

        const sortedActivities = filteredActivities.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setFilteredData(sortedActivities);
        setVisibleData(sortedActivities.slice(0, itemsToShow)); // Initialize visible data
    }, [activitiesData, currentFilter, itemsToShow]);

    const handleLoadMore = () => {
        const nextItems = itemsToShow + 5;
        setItemsToShow(nextItems);
        setVisibleData(filteredData.slice(0, nextItems));
    };

    if (activityError) {
        return <Label className="text-destructive">{activityError}</Label>;
    }

    if (activityLoading) {
        return <div>Loading...</div>;
    }
    type ColorMapping = {
        [key: string]: string;
    };

    const regionColors: ColorMapping = {
        'PSO': '#C80000',
        'RPCO 9': '#ffc124',
        'RPCO 10': '#9117c2',
        'RPCO 11': '#0173bc',
        'RPCO 12': '#ff6f00',
        'RPCO 13': '#ff0090',
        'BARMM': '#3cb54b'
    }

    return (
        <div className="p-6 max-w-5xl self-center w-full">
            {/* Filters Section */}
            <div className="flex flex-wrap gap-2 mb-6">
                {['All', ...statusOptions].map((filter) => (
                    <Button
                        key={filter}
                        className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'hover:bg-blue-100 text-gray-700 dark:hover:bg-blue-700 border-gray-300 rounded-[6px] xs:w-[200px] md:w-fit flex flex-row gap-1 items-center justify-center overflow-hidden text-xs lg:text-sm',
                            {
                                'font-bold hover:bg-blue-100 dark:hover:bg-blue-700 bg-blue-100 dark:bg-blue-700': filter === 'All',
                            }
                        )}
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            {/* Event Cards */}
            <div className="space-y-4">
                {visibleData.map((data: Activity) => (
                    <Card key={data.id} className="border border-gray-300 dark:border-gray-500 shadow-md">
                        <CardContent className="flex flex-row p-4 gap-4 relative overflow-hidden">
                            <div className='absolute -top-24 -right-32 w-48 h-48 -rotate-45 shadow-md' 
                                style={{ backgroundColor: regionColors[data.user.region]}}>

                            </div>
                            {/* Image Section */}
                            <div
                                className='flex-shrink-0 gap-4 flex flex-col'>

                                <Image
                                    src={'/miadp-pso.jpg'}
                                    width={80}
                                    height={80}
                                    alt={`${data.activityTitle} logo`}
                                    className="rounded-full"
                                />
                                <Badge
                                    className={`font-medium cursor-default shadow-sm z-10 dark:text-white hover:${getStatusColor(data.status)} ${getStatusColor(data.status)}`}
                                >
                                    {data.status}
                                    {data.status === 'Ongoing' && (
                                        <div className="h-3 w-3 rounded-full bg-white animate-pulse ml-1"></div>
                                    )}
                                </Badge>
                            </div>

                            {/* Information Section */}
                            <div className="flex flex-col gap-2 w-full pr-10">
                                {/* Date, Type, and Location */}
                                <div className="text-sm">
                                    <Label>{data.dateFrom == data.dateTo ? formatDateLong(data.dateFrom) : `${formatDateLong(data.dateFrom)} - ${formatDateLong(data.dateTo)}`} | </Label>
                                    <Label className="font-semibold">{data.type} | </Label>
                                    <Label>{data.location}</Label>
                                </div>

                                {/* Activity Title */}
                                <Label className="text-xl font-semibold">{data.activityTitle}</Label>

                                {/* Target Participants */}
                                <div className="text-sm flex gap-2">
                                    {data.targetParticipant.split(',').map((item, index) => (
                                        <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                                            {item.trim()}
                                        </Badge>
                                    ))}
                                    <Separator orientation='vertical' />
                                    <Badge>{data.user.region}</Badge>
                                    <Badge>{data.user.component}</Badge>
                                    {data.user.unit && <Badge>{data.user.unit}</Badge>}
                                </div>
                                {/* Activity Details */}
                                <Label className="line-clamp-3 pb-2">{data.activityDescription}</Label>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Load More Button */}
            {visibleData.length < filteredData.length && (
                <div className="mt-6 text-center">
                    <Button variant={'default'} onClick={handleLoadMore}>
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Page;
