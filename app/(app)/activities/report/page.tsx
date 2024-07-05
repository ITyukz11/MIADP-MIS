'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import React from 'react';
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
const data2 = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  // Sort data by total activities
const sortedData = [...data].sort((a, b) => {
    const totalA = a.C1 + a.C2 + a.C3 + a.C4;
    const totalB = b.C1 + b.C2 + b.C3 + b.C4;
    return totalB - totalA;
});
const Page = () => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']; // Colors for components

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
                            {sortedData.map((region, index) => (
                                <>
                                <li key={index} className='flex items-center p-2 rounded-md'>
                                    <div className='flex-shrink-0 mr-3'>
                                        <Image src='/miadp-logo.png' alt='region image' className='rounded-full' width={40} height={40} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-lg font-semibold'>{region.name}</span>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>{region.C1 + region.C2 + region.C3 + region.C4} activities</span>
                                    </div>
                                </li>
                                <Separator/>
                                </>
                            ))}
                        </ol>
                    </div>
                </CardContent>
            </Card>
            <Card className='col-span-8'>
                <CardHeader>
                    <CardTitle>
                        Total Activities by Region
                        <Label className='text-xs text-gray-500 ml-5'>
                            ** All data presented here is for illustrative purposes and does not reflect actual information. **
                        </Label>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="C1" stackId="a" fill="#606dc6" />
                                <Bar dataKey="C2" stackId="a" fill="#5bc49f" />
                                <Bar dataKey="C3" stackId="a" fill="#65c6d2" />
                                <Bar dataKey="C4" stackId="a" fill="#e74c3c" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
