'use client'
import { fetchCountActivitiesData } from '@/app/store/countActivityAction';
import { fetchComponentCountsData } from '@/app/store/countComponentActivityAction';
import { useDispatch, useSelector } from '@/app/store/store';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CountComponentActivity } from '@/types/calendar-of-activity/calendar-of-activity';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartSwitcher, { ChartType } from './components/ChartSwitcher';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchCountActivityParticipantsData } from '@/app/store/calendar-of-activity/countActivityParticipantAction';
import { DataTable } from '@/components/table/data-table';
import { countParticipantActivityColumn } from '@/components/table/data/activities/count-participant-activity-column';

const data = [
    { name: 'PSO', C1: 5, C2: 4, C3: 4, C4: 20, amt: 34 },
    { name: 'RPCO 9', C1: 5, C2: 4, C3: 13, C4: 5, amt: 34 },
    { name: 'RPCO 10', C1: 2, C2: 4, C3: 4, C4: 2, amt: 34 },
    { name: 'RPCO 11', C1: 10, C2: 4, C3: 14, C4: 10, amt: 34 },
    { name: 'RPCO 12', C1: 22, C2: 2, C3: 4, C4: 5, amt: 34 },
    { name: 'RPCO 13', C1: 5, C2: 4, C3: 4, C4: 20, amt: 34 },
    { name: 'BARMM', C1: 1, C2: 4, C3: 4, C4: 10, amt: 34 },
];


const Page = () => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Colors for components

    const dispatch = useDispatch();
    const { countActivitiesData, countActivityLoading, countActivityError } = useSelector((state) => state.countActivity);
    const { countParticipantActivitiesData, countParticipantActivityLoading, countParticipantActivityError } = useSelector((state) => state.countActivityParticipant);
    useEffect(() => {
        if (Object.keys(countActivitiesData).length === 0) {
            dispatch(fetchCountActivitiesData());
        }
    }, [dispatch, countActivitiesData.length, countActivitiesData]);

    useEffect(() => {
        if (Object.keys(countParticipantActivitiesData).length === 0) {
            console.log("countParticipantActivitiesData FETCHING")
            dispatch(fetchCountActivityParticipantsData());
        }
    }, [countParticipantActivitiesData, dispatch]);

    // Ensure the data is typed correctly
    const sortedActivities = Object.entries(countActivitiesData).sort(
        ([, countA]: [string, number], [, countB]: [string, number]) => countB - countA
    );
    const { componentActivityCountsData, componentActivityCountsLoading, componentActivityCountsError } = useSelector((state) => state.countByComponentActivity);
    console.log("countParticipantActivitiesData: ", countParticipantActivitiesData)
    console.log("countParticipantActivityLoading: ", countParticipantActivityLoading)
    console.log("countParticipantActivityError: ", countParticipantActivityError)
    useEffect(() => {
        if (Object.keys(componentActivityCountsData).length === 0) {
            dispatch(fetchComponentCountsData());
        }
    }, [dispatch, componentActivityCountsData]);

    interface ComponentActivityData {
        name: string;
        amt: number;
        [key: string]: number | string; // Allow dynamic keys with number or string values
    }


    const transformData = (data: CountComponentActivity): ComponentActivityData[] => {
        // Extract all unique components
        const components = Array.from(
            new Set(Object.values(data).flatMap(region => Object.keys(region)))
        );

        // Convert the data to the format required by the BarChart
        return Object.entries(data).map(([region, counts]) => {
            // Create an object with component counts and total amount
            const transformed: ComponentActivityData = { name: region, amt: Object.values(counts).reduce((sum, count) => sum + count, 0) };

            // Add counts for each component
            components.forEach(component => {
                transformed[component] = counts[component] || 0;
            });
            return transformed;
        });
    };

    const transformedData = transformData(componentActivityCountsData);

    const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);

    const handleChange = (value: string) => {
        setChartType(value as ChartType);
    };
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
                <Card className='col-span-1 md:col-span-1'>
                    <CardHeader>
                        <CardTitle>
                            Rankings
                            <Label className='text-xs text-gray-500 ml-5'>
                                ** Most activities **
                            </Label>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='w-full h-96 overflow-y-auto scrollbar-thin'>
                            <ol className='space-y-3'>
                                {countActivityLoading &&
                                    <>
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                    </>}
                                {sortedActivities && sortedActivities.map(([region, count], index) => (
                                    <React.Fragment key={index}>
                                        <li
                                            className={`flex items-center p-2 rounded-md ${index === 0 ? 'bg-yellow-100 border border-yellow-300' : ''}`}
                                        >
                                            <div className='flex-shrink-0 mr-3'>
                                                <Image src='/miadp-logo.png' alt='region image' className='rounded-full' width={40} height={40} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <div className='flex items-center'>
                                                    <span className={`text-lg font-semibold ${index === 0 && 'text-black'}`}>{region}</span>
                                                    {index === 0 && (
                                                        <FaCrown className='ml-2 text-yellow-500' size={24} /> // Display crown icon for the top item
                                                    )}
                                                </div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>{count} activities</span>
                                            </div>
                                        </li>
                                        <Separator />
                                    </React.Fragment>
                                ))}
                                {countActivityError && <Label className='text-red-500'>*{countActivityError}</Label>}
                            </ol>
                        </div>
                    </CardContent>
                </Card>
                <Card className='col-span-1 md:col-span-3 overflow-hidden'>
                    <CardHeader className='flex flex-row gap-1 justify-between items-start'>
                        <CardTitle>
                            Total Activities by Region
                            <Label className='text-xs text-gray-500 ml-5'>
                                ** All data presented here represents the totals from the major activities encoded over time. **
                            </Label>
                            {componentActivityCountsLoading && <LoadingSpinner />}
                        </CardTitle>
                        <div>
                            <Select
                                value={chartType}
                                onValueChange={handleChange}
                                defaultValue={ChartType.BAR}
                            >
                                <SelectTrigger className='text-xs sm:text-sm'>
                                    <SelectValue placeholder="Select Chart Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ChartType.BAR}>{ChartType.BAR}</SelectItem>
                                    <SelectItem value={ChartType.LINE}>{ChartType.LINE}</SelectItem>
                                    <SelectItem value={ChartType.AREA}>{ChartType.AREA}</SelectItem>
                                    <SelectItem value={ChartType.RADAR}>{ChartType.RADAR}</SelectItem>
                                    <SelectItem value={ChartType.TREEMAP}>{ChartType.TREEMAP}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartSwitcher data={transformedData} typeChart={chartType} />
                    </CardContent>
                </Card>
            </div>
            <div>

                {componentActivityCountsLoading ?
                    <div className="space-y-2 mt-3 p-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div> :
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Total activities as participants
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={countParticipantActivitiesData}
                                columns={countParticipantActivityColumn}
                                allowDateRange={false}
                                allowSelectRow={false}
                            />
                        </CardContent>
                    </Card>}
            </div>
        </>

    );
};

export default Page;
