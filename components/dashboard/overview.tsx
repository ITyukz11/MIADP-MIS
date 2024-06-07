"use client"

import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, TooltipProps } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui/select'; // Assuming these components are available
import { Label } from '../ui/label';

type RegionData = {
  month: string;
  Meeting: number;
  Training: number;
  "Training Workshop": number;
  Consultation: number;
  Orientation: number;
  "ADAIF Presentation": number;
  "Community Validation": number;
  "Sub Project Deliberation": number;
  ISM: number;
  Other: number;
};

const regionsData: Record<string, RegionData[]> = {
  PSO: [
    { month: "January", Meeting: 2, Training: 1, "Training Workshop": 1, Consultation: 0, Orientation: 0, "ADAIF Presentation": 1, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "February", Meeting: 1, Training: 2, "Training Workshop": 0, Consultation: 1, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "March", Meeting: 0, Training: 1, "Training Workshop": 0, Consultation: 0, Orientation: 1, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
    { month: "April", Meeting: 2, Training: 0, "Training Workshop": 1, Consultation: 1, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "May", Meeting: 1, Training: 0, "Training Workshop": 0, Consultation: 0, Orientation: 1, "ADAIF Presentation": 1, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "June", Meeting: 0, Training: 0, "Training Workshop": 0, Consultation: 1, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "July", Meeting: 0, Training: 0, "Training Workshop": 1, Consultation: 0, Orientation: 0, "ADAIF Presentation": 1, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "August", Meeting: 0, Training: 0, "Training Workshop": 0, Consultation: 1, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
    { month: "September", Meeting: 0, Training: 0, "Training Workshop": 0, Consultation: 0, Orientation: 1, "ADAIF Presentation": 0, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "October", Meeting: 0, Training: 0, "Training Workshop": 0, Consultation: 0, Orientation: 0, "ADAIF Presentation": 1, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "November", Meeting: 0, Training: 0, "Training Workshop": 1, Consultation: 0, Orientation: 1, "ADAIF Presentation": 0, "Community Validation": 1, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
    { month: "December", Meeting: 0, Training: 0, "Training Workshop": 0, Consultation: 1, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
  ],
  "RPCO 9": [
    { month: "January", Meeting: 1, Training: 2, "Training Workshop": 1, Consultation: 0, Orientation: 1, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
    { month: "February", Meeting: 2, Training: 1, "Training Workshop": 0, Consultation: 1, Orientation: 0, "ADAIF Presentation": 1, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "March", Meeting: 0, Training: 1, "Training Workshop": 1, Consultation: 0, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "April", Meeting: 1, Training: 0, "Training Workshop": 0, Consultation: 1, Orientation: 1, "ADAIF Presentation": 1, "Community Validation": 1, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
    { month: "May", Meeting: 2, Training: 1, "Training Workshop": 0, Consultation: 0, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "June", Meeting: 0, Training: 0, "Training Workshop": 1, Consultation: 0, Orientation: 1, "ADAIF Presentation": 0, "Community Validation": 1, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
    { month: "July", Meeting: 1, Training: 0, "Training Workshop": 0, Consultation: 1, Orientation: 0, "ADAIF Presentation": 1, "Community Validation": 0, "Sub Project Deliberation": 0, ISM: 1, Other: 0 },
    { month: "Augugust", Meeting: 2, Training: 1, "Training Workshop": 1, Consultation: 0, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "September", Meeting: 0, Training: 0, "Training Workshop": 0, Consultation: 1, Orientation: 1, "ADAIF Presentation": 1, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "October", Meeting: 1, Training: 0, "Training Workshop": 1, Consultation: 0, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 0, "Sub Project Deliberation": 1, ISM: 1, Other: 0 },
    { month: "November", Meeting: 2, Training: 1, "Training Workshop": 0, Consultation: 1, Orientation: 1, "ADAIF Presentation": 1, "Community Validation": 1, "Sub Project Deliberation": 0, ISM: 0, Other: 0 },
    { month: "December", Meeting: 0, Training: 0, "Training Workshop": 1, Consultation: 0, Orientation: 0, "ADAIF Presentation": 0, "Community Validation": 1, "Sub Project Deliberation": 1, ISM: 0, Other: 0 },
  ],
  "RPCO 10": [],
  "RPCO 11": [],
  "RPCO 12": [],
  "RPCO 13": [],
  "BARMM": [],
};

const years = ['2024', '2025']; // Add more years as needed
const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function Overview() {
  const [selectedRegion, setSelectedRegion] = useState<string>('PSO');
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);


  const filteredData = selectedMonth === "All"
    ? regionsData[selectedRegion]
    : regionsData[selectedRegion].filter(data => data.month === selectedMonth);

  type CustomTooltipProps = TooltipProps<number, string>;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-700 text-white rounded shadow-lg">
          <Label className="font-bold">{label}</Label>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <Label>{entry.name}: {entry.value}</Label>
            </p>
          ))}
        </div>
      );
    }

    return null;
  };


  return (
    <div className="space-y-4">
      <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
        <div className='flex flex-row gap-2 flex-wrap'>
          <TabsList>
            {Object.keys(regionsData).map((region) => {
              return (
                <TabsTrigger
                  key={region}
                  value={region}
                >
                  {region}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <div>
            <Select onValueChange={setSelectedMonth}>
              <SelectTrigger>
                {selectedMonth}
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select onValueChange={setSelectedYear}>
              <SelectTrigger>
                {selectedYear}
              </SelectTrigger>
              <SelectContent className='w-fit'>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {Object.keys(regionsData).map((region) => (
          <TabsContent key={region} value={region} className="mt-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Meeting" fill="#ff6384" />
                <Bar dataKey="Training" fill="#36a2eb" />
                <Bar dataKey="Training Workshop" fill="#ffce56" />
                <Bar dataKey="Consultation" fill="#4bc0c0" />
                <Bar dataKey="Orientation" fill="#9966ff" />
                <Bar dataKey="ADAIF Presentation" fill="#ff9f40" />
                <Bar dataKey="Community Validation" fill="#e83e8c" />
                <Bar dataKey="Sub Project Deliberation" fill="#1abc9c" />
                <Bar dataKey="ISM" fill="#8e44ad" />
                <Bar dataKey="Other" fill="#d35400" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
