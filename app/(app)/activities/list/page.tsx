'use client';
import { useCalendarOfActivityFilter } from '@/components/context/FilterRegionContext';
import { formatDate, getStatusColor } from '@/components/table/data/activities/coa-columns';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivitiesData } from '@/lib/calendar-of-activity/useActivitiesDataHook';
import { statusOptions } from '@/lib/data/filter';
import { cn } from '@/lib/utils';
import { Activity } from '@/types/calendar-of-activity/calendar-of-activity';
import { formatDateLong, formatDateShort } from '@/utils/dateFormat';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Page: React.FC = () => {
    const { activitiesData, activityError, activityLoading } = useActivitiesData();
    const [filteredData, setFilteredData] = useState<Activity[]>([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const [coaData, setCoaData] = useState<any[]>([]);
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
        setCoaData(sortedActivities);
        setFilteredData(sortedActivities);
    }, [activitiesData, currentFilter, itemsToShow]);

    useEffect(() => {
        if (currentFilter?.filter === 'All' && currentFilter?.unit === 'All' && currentFilter?.status === 'All') {
            console.log("1");
            console.log("region: ", currentFilter?.filter);
            console.log("unit/component: ", currentFilter?.unit);
            console.log("status: ", currentFilter?.status);
            setFilteredData(coaData); // Return all data
        }
        else if (currentFilter?.filter !== 'All' && currentFilter?.unit === 'All' && currentFilter?.status === 'All') {
            console.log("2");
            const filtered = coaData.filter(item =>
                item.user?.region === currentFilter?.filter
            );
            setFilteredData(filtered); // Filter by region only
        }
        else if (currentFilter?.filter === 'All' && currentFilter?.unit !== 'All' && currentFilter?.status === 'All') {
            console.log("3");
            const filtered = coaData.filter(item =>
                item.user?.unit === currentFilter?.unit ||
                item.user?.component === currentFilter?.unit
            );
            setFilteredData(filtered); // Filter by unit/component only
        }
        else if (currentFilter?.filter !== 'All' && currentFilter?.unit !== 'All' && currentFilter?.status === 'All') {
            console.log("4");
            const filtered = coaData.filter(item =>
                item.user?.region === currentFilter?.filter &&
                (
                    item.user?.unit === currentFilter?.unit ||
                    item.user?.component === currentFilter?.unit
                )
            );
            setFilteredData(filtered); // Filter by region and unit/component
        }
        else {
            console.log("5");
            // Combine all filters including status
            const filtered = coaData.filter(item =>
                (currentFilter?.filter === 'All' || item.user?.region === currentFilter?.filter) &&
                (currentFilter?.unit === 'All' ||
                    item.user?.unit === currentFilter?.unit ||
                    item.user?.component === currentFilter?.unit) &&
                (currentFilter?.status === 'All' || item.status === currentFilter?.status)
            );
            setFilteredData(filtered); // Apply all filters
        }
    }, [coaData, currentFilter]);




    const handleLoadMore = () => {
        const nextItems = itemsToShow + 5;
        setItemsToShow(nextItems);
    };

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

    type RegionLogoMapping = {
        [key: string]: string;
    };

    const regionLogo: RegionLogoMapping = {
        'PSO': '/miadp-pso.jpg',
        'RPCO 9': '/miadp-region-ix.jpg',
        'RPCO 10': '/miadp-region-x.jpg',
        'RPCO 11': '/miadp-region-xi.jpg',
        'RPCO 12': '/miadp-region-xii.jpg',
        'RPCO 13': '/miadp-region-xiii.jpg',
        'BARMM': '/miadp-barmm.jpg'
    }

    const cryingCat = [
        '/crying-cat/crying-cat-1.gif',
        '/crying-cat/crying-cat-2.gif',
        '/crying-cat/crying-cat-3.gif',
        '/crying-cat/crying-cat-4.gif',
        '/crying-cat/crying-cat-5.gif',
    ]

    
    if (activityError) {
        return <Label className="text-destructive">{activityError}</Label>;
    }

    if (activityLoading) {
        return <div className='flex flex-col gap-4 max-w-5xl self-center w-full'>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
        </div>;
    }

    if (filteredData.length == 0) return (
        <div className='flex flex-col items-center'>

            <Label className='text-destructive text-3xl font-bold'>No data</Label>
            <Image
                src={cryingCat[Math.floor(Math.random() * cryingCat.length)]}
                width={300}
                height={300}
                alt="Crying cat logo"
                className="rounded-xl"
            />
        </div>
    );



    return (
        <div className="max-w-5xl self-center w-full">
            {/* Filters Section */}
            {/* <div className="flex flex-wrap gap-2 mb-6">
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
            </div> */}

            {/* Event Cards */}
            <div className="space-y-4">
                {filteredData.slice(0, itemsToShow).map((data: Activity) => (
                    <Card key={data.id} className="shadow-md">
                        <CardContent className="flex flex-row p-4 gap-4 relative overflow-hidden rounded-tr-xl">
                            {/* Region Color */}
                            {/* <div className='absolute -top-24 -right-32 w-48 h-48 -rotate-45 shadow-md'
                                style={{ backgroundColor: regionColors[data.user.region] }}>
                            </div> */}
                            <div className='hidden absolute top-0 right-0 w-28 h-16 rounded-bl-full shadow-md md:flex justify-center items-center border-2'
                                style={{ backgroundColor: regionColors[data.user.region] }}>
                                <Label className='text-2xl ml-4 mb-1 text-white'>{formatDateShort(data.dateFrom)}</Label>
                            </div>

                            {/* Image Section */}
                            <div className='hidden flex-shrink-0 gap-4 md:flex flex-col'>
                                <Image
                                    src={regionLogo[data.user.region]}
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
                            <div className="flex flex-col gap-2 w-full md:pr-14">
                                {/* Date, Type, and Location */}
                                <div className="text-sm">
                                    <Label>{data.dateFrom == data.dateTo ? formatDateLong(data.dateFrom) : `${formatDateLong(data.dateFrom)} - ${formatDateLong(data.dateTo)}`} | </Label>
                                    <Label className="font-semibold">{data.type} | </Label>
                                    <Label>{data.location}</Label>
                                </div>

                                {/* Activity Title */}
                                <Label className="text-xl font-semibold">{data.activityTitle}</Label>

                                {/* Target Participants */}
                                <div className="text-sm flex gap-2 flex-wrap items-center">
                                    {/* Target Participants */}
                                    {data.targetParticipant.split(',').map((item, index) => (
                                        <Badge
                                            key={index}>
                                            {item.trim()}
                                        </Badge>
                                    ))}
                                    <Separator orientation="vertical" className="h-4 mx-2" />
                                    {/* Region and Component / Unit */}
                                    <Badge className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md whitespace-nowrap">
                                        {data.user.region}
                                    </Badge>
                                    <Badge className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md whitespace-nowrap">
                                        {data.user.component}
                                    </Badge>
                                    {data.user.unit && (
                                        <Badge className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md whitespace-nowrap">
                                            {data.user.unit}
                                        </Badge>
                                    )}
                                </div>
                                {/* Activity Details */}
                                <Label className="pb-2">{data.activityDescription}</Label>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Load More Button */}
            {filteredData.slice(0, itemsToShow).length < filteredData.length && (
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
