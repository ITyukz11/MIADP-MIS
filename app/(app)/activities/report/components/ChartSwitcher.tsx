import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ScatterChart, Scatter, XAxis as ScatterXAxis, YAxis as ScatterYAxis } from 'recharts';
import { Treemap } from 'recharts';
import CustomizedContent from './CutomizedContent';

interface ComponentActivityData {
    name: string;
    amt: number;
    color?: string; // Optional color field for Treemap
    [key: string]: number | string | undefined; // Allow dynamic keys with number, string, or undefined values
}

interface Props {
    data: ComponentActivityData[];
    typeChart: ChartType;
}

export enum ChartType {
    BAR = 'Bar Chart',
    LINE = 'Line Chart',
    PIE = 'Pie Chart',
    AREA = 'Area Chart',
    RADAR = 'Radar Chart',
    SCATTER = 'Scatter Chart',
    TREEMAP = 'Treemap Chart',
}

const COLORS = ['#3cb54b', '#9117c2', '#ff6f00', '#ffc124', '#ff0090', '#C80000','#0173bc']; // Define your color palette

const ChartSwitcher: React.FC<Props> = ({ data, typeChart }) => {
    const renderChart = (): React.ReactElement => {
        switch (typeChart) {
            case ChartType.BAR:
                return (
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
                        <Bar dataKey="Component 1" stackId="a" fill="#606dc6" />
                        <Bar dataKey="Component 2" stackId="a" fill="#5bc49f" />
                        <Bar dataKey="Component 3" stackId="a" fill="#65c6d2" />
                        <Bar dataKey="Component 4" stackId="a" fill="#e74c3c" />
                    </BarChart>
                );
            case ChartType.LINE:
                return (
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Component 1" stroke="#606dc6" />
                        <Line type="monotone" dataKey="Component 2" stroke="#5bc49f" />
                        <Line type="monotone" dataKey="Component 3" stroke="#65c6d2" />
                        <Line type="monotone" dataKey="Component 4" stroke="#e74c3c" />
                    </LineChart>
                );
            case ChartType.AREA:
                return (
                    <AreaChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="Component 1" stroke="#606dc6" fill="#cfe2ff" />
                        <Area type="monotone" dataKey="Component 2" stroke="#5bc49f" fill="#d0f0c0" />
                        <Area type="monotone" dataKey="Component 3" stroke="#65c6d2" fill="#e0f7fa" />
                        <Area type="monotone" dataKey="Component 4" stroke="#e74c3c" fill="#ffebee" />
                    </AreaChart>
                );
            case ChartType.RADAR:
                return (
                    <RadarChart outerRadius={90} width={500} height={300} data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis />
                        <Radar name="Component 1" dataKey="Component 1" stroke="#606dc6" fill="#cfe2ff" />
                        <Radar name="Component 2" dataKey="Component 2" stroke="#5bc49f" fill="#d0f0c0" />
                        <Radar name="Component 3" dataKey="Component 3" stroke="#65c6d2" fill="#e0f7fa" />
                        <Radar name="Component 4" dataKey="Component 4" stroke="#e74c3c" fill="#ffebee" />
                    </RadarChart>
                );
            case ChartType.SCATTER:
                return (
                    <ScatterChart width={500} height={300}>
                        <Scatter data={data} fill="#8884d8">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={String(entry.color) || '#8884d8'} />
                            ))}
                        </Scatter>
                        <ScatterXAxis dataKey="name" />
                        <ScatterYAxis />
                        <Tooltip />
                        <Legend />
                    </ScatterChart>
                );
            case ChartType.TREEMAP:
                return (
                    <Treemap
                        width={500}
                        height={300}
                        data={data}
                        dataKey="amt"
                        stroke="#fff"
                        content={<CustomizedContent colors={COLORS} root={undefined} depth={0} x={0} y={0} width={0} height={0} index={0} payload={undefined} rank={0} name={''} />}
                    >
                        <Tooltip />
                    </Treemap>
                );
            default:
                return <></>; // Return an empty fragment as a fallback
        }
    };


    return (
        <div>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartSwitcher;
