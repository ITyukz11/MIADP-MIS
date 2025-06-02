'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useADPlanProcessDocReportData } from '@/lib/ad-plan/process-doc-report/useProcessDocReportHook';
import {
    FaChartBar,
    FaUsers,
    FaVenusMars,
    FaUserFriends,
    FaGlobeAmericas,
    FaChartLine,
} from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { ProcessDocReportType } from '../../components/forms/ProcessDocumentReportForm';
import { Label } from '@/components/ui/label';
import DynamicMonthlyChart from '../(components)/DynamicMonthlyChart';

interface ProcessDocData {
    activityTitle: string;
    WFPActivity: string;
    activityObjectives: string;
    dateConducted: Date;
    region: string;
    province: string;
    city: string;
    municipality: string;
    baranggay: string;
    totalMaleIP: string;
    totalFemaleIP: string;
    totalMaleNonIP: string;
    totalFemaleNonIP: string;
    postOtherActivity?: string;
}

const COLORS = ['#4f46e5', '#a78bfa', '#c7d2fe', '#ddd6fe'];
const chartTypes = ['bar', 'line', 'area'] as const;
type ChartType = typeof chartTypes[number];

interface ProcessDocDashboardProps {
    data: ProcessDocReportType[]
}
export function ProcessDocDashboard({ data }: ProcessDocDashboardProps) {
    const {
        adPlanProcDocReportLoading: loading,
        adPlanProcDocReportError: error,
    } = useADPlanProcessDocReportData();

    if (error) return <p>Error loading data</p>;
    if (!data && !loading) return <p>No data available</p>;

    // Aggregate calculations
    const totalActivities = data?.length || 0;

    const totalParticipants = data?.reduce(
        (acc: number, curr: ProcessDocData) =>
            acc +
            parseInt(curr.totalMaleIP) +
            parseInt(curr.totalFemaleIP) +
            parseInt(curr.totalMaleNonIP) +
            parseInt(curr.totalFemaleNonIP),
        0
    ) || 0;

    const genderBreakdown = {
        Male: data?.reduce((sum: number, r: ProcessDocData) => sum + parseInt(r.totalMaleIP) + parseInt(r.totalMaleNonIP), 0) || 0,
        Female: data?.reduce((sum: number, r: ProcessDocData) => sum + parseInt(r.totalFemaleIP) + parseInt(r.totalFemaleNonIP), 0) || 0,
    };

    const ipBreakdown = {
        IP: data?.reduce((sum: number, r: ProcessDocData) => sum + parseInt(r.totalMaleIP) + parseInt(r.totalFemaleIP), 0) || 0,
        NonIP: data?.reduce((sum: number, r: ProcessDocData) => sum + parseInt(r.totalMaleNonIP) + parseInt(r.totalFemaleNonIP), 0) || 0,
    };

    // Average participants per activity
    const averageParticipants =
        totalActivities > 0 ? (totalParticipants / totalActivities).toFixed(1) : '0';

    // Monthly activities data
    const monthlyData = Object.values(
        (data || []).reduce((acc: Record<string, { month: string; count: number; participants: number }>, curr: ProcessDocData) => {
            const month = new Date(curr.dateConducted).toLocaleString('default', {
                month: 'short',
                year: 'numeric',
            });
            acc[month] = acc[month] || { month, count: 0, participants: 0 };
            acc[month].count += 1;
            acc[month].participants +=
                parseInt(curr.totalMaleIP) +
                parseInt(curr.totalFemaleIP) +
                parseInt(curr.totalMaleNonIP) +
                parseInt(curr.totalFemaleNonIP);
            return acc;
        }, {} as Record<string, { month: string; count: number; participants: number }>)
    ).sort(
        (a, b) =>
            new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime()
    );

    // Top regions by activity count
    const regionsCount = Object.entries(
        (data || []).reduce((acc: Record<string, number>, curr: ProcessDocData) => {
            const region = curr.region || 'Unknown';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {})
    )
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Prepare Pie Chart data for gender and IP breakdown
    const genderPieData = [
        { name: 'Male', value: genderBreakdown.Male },
        { name: 'Female', value: genderBreakdown.Female },
    ];

    const ipPieData = [
        { name: 'IP', value: ipBreakdown.IP },
        { name: 'Non-IP', value: ipBreakdown.NonIP },
    ];



    const topWFPActivities = Object.entries(
        data.reduce((acc: Record<string, number>, curr) => {
            const wfpActivity = curr.WFPActivity || 'Unknown WFP Activity';
            acc[wfpActivity] = (acc[wfpActivity] || 0) + 1;
            return acc;
        }, {})
    )
        .map(([WFPActivity, count]) => ({ WFPActivity, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);


    return (
        <div className='overflow-y-hidden space-y-4'>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Cards */}
                <Card className="cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                        <FaChartBar className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="w-full h-10" /> :
                            <>
                                <div className="text-2xl font-bold">{totalActivities}</div>
                                <p className="text-xs text-muted-foreground">+ data still in beta</p>
                            </>
                        }
                    </CardContent>
                </Card>

                <Card className="cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium"># of Participants</CardTitle>
                        <FaUsers className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-10" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{totalParticipants}</div>
                                <p className="text-xs text-muted-foreground">+ data still in beta</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Male / Female</CardTitle>
                        <FaVenusMars className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-10" />
                        ) : (
                            <>
                                <div className="text-xl font-bold">
                                    {genderBreakdown.Male} / {genderBreakdown.Female}
                                </div>
                                <p className="text-xs text-muted-foreground">+ data still in beta</p>
                            </>

                        )}
                    </CardContent>
                </Card>

                <Card className="cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">IP / Non-IP</CardTitle>
                        <FaUserFriends className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-10" />
                        ) : (
                            <>
                                <div className="text-xl font-bold">
                                    {ipBreakdown.IP} / {ipBreakdown.NonIP}
                                </div>
                                <p className="text-xs text-muted-foreground">+ data still in beta</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Pie Chart for Gender */}
                <Card className="col-span-1 md:col-span-2 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gender Breakdown</CardTitle>
                        <FaVenusMars className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-40" />
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={genderPieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {genderPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
                {/* Pie Chart for IP vs Non-IP */}
                <Card className="col-span-1 md:col-span-2 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">IP vs Non-IP Breakdown</CardTitle>
                        <FaUserFriends className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-40" />
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={ipPieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {ipPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            <DynamicMonthlyChart data={monthlyData} />
                {/* Top WFP Activities by Count */}
                <Card className="col-span-full cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top WFP Activities by Count</CardTitle>
                        <FaChartBar className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-40" />
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    layout="vertical"
                                    data={topWFPActivities}
                                    margin={{ top: 10, right: 20, bottom: 20, left: 150 }}
                                >
                                    <XAxis type="number" />
                                    <YAxis
                                        dataKey="WFPActivity"
                                        type="category"
                                        tick={{ fontSize: 12 }}
                                        width={180}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#a78bfa" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Top Regions by Activity Count */}
                <Card className="col-span-full cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Regions by Activities</CardTitle>
                        <FaGlobeAmericas className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-40" />
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    layout="vertical"
                                    data={regionsCount}
                                    margin={{ top: 10, right: 20, bottom: 20, left: 40 }}
                                >
                                    <XAxis type="number" />
                                    <YAxis
                                        dataKey="region"
                                        type="category"
                                        tick={{ fontSize: 12 }}
                                        width={100}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>


                {/* New Card: Average Participants per Activity */}
                <Card className="cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Participants / Activity</CardTitle>
                        <FaChartLine className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent className='h-full flex justify-center items-center'>
                        {loading ? (
                            <Skeleton className="w-full h-full" />
                        ) : (
                            <Label className="text-4xl font-bold text-center md:text-5xl lg:text-6xl mb-20">{averageParticipants}</Label>
                        )}
                    </CardContent>
                </Card>
                {/* Monthly Activity and Participants Line Chart */}
                <Card className="col-span-full md:col-span-3 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Activities & Participants</CardTitle>
                        <FaChartBar className="text-muted-foreground w-5 h-5" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="w-full h-56" />
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyData}>
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" label={{ value: 'Activities', angle: -90, position: 'insideLeft' }} />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{ value: 'Participants', angle: 90, position: 'insideRight' }}
                                    />
                                    <Tooltip />
                                    <Legend verticalAlign="top" />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#4f46e5"
                                        activeDot={{ r: 8 }}
                                        name="Activities"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="participants"
                                        stroke="#a78bfa"
                                        name="Participants"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
