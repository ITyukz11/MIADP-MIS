import { useState } from 'react';
import {
    BarChart, Bar,
    LineChart, Line,
    AreaChart, Area,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";

const chartTypes = ['bar', 'line', 'area'] as const;
type ChartType = typeof chartTypes[number];

interface MonthlyData {
    month: string;
    count: number;
    participants: number;
}


function DynamicMonthlyChart({ data }: { data: MonthlyData[] }) {
    const [chartType, setChartType] = useState<ChartType>('bar');
    console.log("Monthly chart data:", data); // 👈 Debug line
    console.log("chart type: ", chartType)
    return (
        <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monthly Activity Trend</CardTitle>
                <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                    <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className='h-fit'>
                {chartType === 'bar' && (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="participants" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
                {chartType === 'line' && (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="participants" stroke="#4f46e5" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
                {chartType === 'area' && (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="participants" stroke="#4f46e5" fill="#c7d2fe" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default DynamicMonthlyChart;
