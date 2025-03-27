import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Treemap,
  LabelList,
} from "recharts";

// Define a set of different colors
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#ff4d4d",
  "#a83279",
  "#2a9d8f",
  "#e76f51",
  "#4d908e",
  "#e63946",
];
export const CommodityRankingChart = ({ data }: any) => {
  // Calculate the total count of commodities
  const totalCount = data.reduce(
    (sum: number, item: { count: number }) => sum + item.count,
    0
  );

  return (
    <div>
      {/* ✅ Display the Total Count Above the Chart */}
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Total Commodities Count: {totalCount}
      </h2>

      <ResponsiveContainer width="100%" height={700}>
        <BarChart
          layout="vertical"
          data={data.sort(
            (a: { count: number }, b: { count: number }) => b.count - a.count
          )}
          margin={{ left: 50, right: 30, top: 10, bottom: 10 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Commodity Count">
            {/* ✅ Add LabelList to display the count on the bars */}
            <LabelList
              dataKey="count"
              position="right"
              fill="#000"
              fontSize={14}
            />
            {data.map((_: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* 🔵 Bar Chart - Compares the Number of Subprojects per Region */
export const SubProjectBarChart = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data}>
      <XAxis dataKey="region" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey={(entry) => entry.subproject.length}
        fill="#8884d8"
        name="Subprojects"
      />
    </BarChart>
  </ResponsiveContainer>
);

// 🟠 Pie Chart - Shows Distribution of Subprojects by Region
export const SubProjectPieChart = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie
        data={data}
        dataKey={(entry) => entry.subproject.length}
        nameKey="region"
        outerRadius={150}
        label
      >
        {data.map((_: any, index: number) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

/* 🟢 Line Chart - Tracks the Number of Subprojects Created Over Time */
export const SubProjectLineChart = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <XAxis
        dataKey="validated"
        tickFormatter={(date) => new Date(date).toLocaleDateString()}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey={(entry) => entry.subproject.length}
        stroke="#8884d8"
        name="Subprojects"
      />
    </LineChart>
  </ResponsiveContainer>
);

/* 🔵 Area Chart - Represents Subprojects Count Across Different LGUs */
export const SubProjectAreaChart = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart data={data}>
      <XAxis dataKey="lgu" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area
        type="monotone"
        dataKey={(entry) => entry.subproject.length}
        stroke="#82ca9d"
        fill="#82ca9d"
        name="Subprojects"
      />
    </AreaChart>
  </ResponsiveContainer>
);

/* 🟣 Radar Chart - Compares Infra vs. Entrep per Region */
export const SubProjectRadarChart = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <RadarChart outerRadius={150} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="region" />
      <PolarRadiusAxis />
      <Radar
        name="Infra/Entrep"
        dataKey={(entry) => (entry.infraEntrep === "INFRA" ? 1 : 2)}
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.6}
      />
      <Legend />
    </RadarChart>
  </ResponsiveContainer>
);

/* 🔴 Scatter Chart - Shows the Spread of Subprojects by Commodity */
export const SubProjectScatterChart = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <ScatterChart>
      <XAxis dataKey="commodities" type="category" />
      <YAxis dataKey={(entry) => entry.subproject.length} />
      <Tooltip />
      <Legend />
      <Scatter name="Subprojects" data={data} fill="#ff7300" />
    </ScatterChart>
  </ResponsiveContainer>
);

/* 🟡 Treemap Chart - Visualizes the Distribution of Subprojects */
export const SubProjectTreemap = ({ data }: any) => (
  <ResponsiveContainer width="100%" height={400}>
    <Treemap
      data={data.map((entry: { lgu: any; subproject: string | any[] }) => ({
        name: entry.lgu,
        size: entry.subproject.length,
      }))}
      dataKey="size"
      stroke="#fff"
      fill="#8884d8"
    />
  </ResponsiveContainer>
);
