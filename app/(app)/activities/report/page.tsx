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
import React, { useEffect } from 'react';
import { FaCrown } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    useEffect(() => {
        if (Object.keys(countActivitiesData).length === 0) {
            dispatch(fetchCountActivitiesData());
        }
    }, [dispatch, countActivitiesData.length, countActivitiesData]);

    // Ensure the data is typed correctly
    const sortedActivities = Object.entries(countActivitiesData).sort(
        ([, countA]: [string, number], [, countB]: [string, number]) => countB - countA
    );
    const { componentActivityCountsData, componentActivityCountsLoading, componentActivityCountsError } = useSelector((state) => state.countByComponentActivity);

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
    return (
        <div className='grid grid-cols-10 gap-2'>
            <Card className='col-span-2'>
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
            <Card className='col-span-8'>
                <CardHeader>
                    <CardTitle>
                        Total Activities by Region
                        <Label className='text-xs text-gray-500 ml-5'>
                            ** All data presented here represents the totals from the major activities encoded over time. **
                        </Label>
                        {componentActivityCountsLoading && <LoadingSpinner/>}

                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ width: '100%', height: 400 }}>
                        {componentActivityCountsError && <Label className='text-red-500'>{componentActivityCountsError}</Label>}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={transformedData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Component 1" stackId="a" fill="#606dc6" />
                                <Bar dataKey="Component 2" stackId="a" fill="#5bc49f" />
                                <Bar dataKey="Component 3" stackId="a" fill="#65c6d2" />
                                <Bar dataKey="Component 4" stackId="a" fill="#e74c3c" />
                            </BarChart>
                        </ResponsiveContainer>
                        {/* {Object.entries(componentActivityCountsData).map(([region, components]) => (
                            <div key={region}>
                                <h2>{region}</h2>
                                <ul>
                                    {Object.entries(components).map(([component, count]) => (
                                        <li key={component}>{component}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                        ))} */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
