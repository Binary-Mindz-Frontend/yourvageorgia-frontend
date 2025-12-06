"use client";

import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// ------------- TYPES --------------------------------------------------

export interface SalesDataItem {
  name: string;
  value: number;
}

interface SalesChartProps {
  title?: string;
  data?: SalesDataItem[];
  showDateFilter?: boolean;
}

// Custom tooltip props (fully typed)
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

// ------------------
// Move CustomTooltip OUTSIDE
// ------------------
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-blue-500 text-white px-3 py-2 rounded shadow-lg text-sm font-semibold">
        {payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

// ----------------------------------------------------------------------

const SalesChart = ({
  title = "Sales Details",
  data,
  showDateFilter = true,
}: SalesChartProps) => {
  const [selectedPeriod] = useState("Today");

  const defaultData: SalesDataItem[] = [
    { name: "5k", value: 20 },
    { name: "6k", value: 25 },
    { name: "7k", value: 30 },
    { name: "8k", value: 32 },
    { name: "9k", value: 48 },
    { name: "10k", value: 50 },
    { name: "11k", value: 42 },
    { name: "12k", value: 52 },
    { name: "13k", value: 48 },
    { name: "14k", value: 55 },
    { name: "15k", value: 32 },
    { name: "16k", value: 38 },
    { name: "17k", value: 42 },
    { name: "18k", value: 52 },
    { name: "19k", value: 48 },
    { name: "20k", value: 95 },
    { name: "21k", value: 35 },
    { name: "22k", value: 52 },
    { name: "23k", value: 48 },
    { name: "24k", value: 50 },
    { name: "25k", value: 45 },
    { name: "26k", value: 52 },
    { name: "27k", value: 42 },
    { name: "28k", value: 55 },
    { name: "29k", value: 48 },
    { name: "30k", value: 42 },
    { name: "31k", value: 52 },
    { name: "32k", value: 48 },
    { name: "33k", value: 62 },
    { name: "34k", value: 55 },
    { name: "35k", value: 25 },
    { name: "36k", value: 32 },
    { name: "37k", value: 28 },
    { name: "38k", value: 48 },
    { name: "39k", value: 50 },
    { name: "40k", value: 52 },
    { name: "41k", value: 48 },
    { name: "42k", value: 45 },
    { name: "43k", value: 75 },
    { name: "44k", value: 72 },
    { name: "45k", value: 62 },
    { name: "46k", value: 68 },
    { name: "47k", value: 65 },
    { name: "48k", value: 60 },
    { name: "49k", value: 58 },
    { name: "50k", value: 55 },
    { name: "51k", value: 57 },
    { name: "52k", value: 55 },
    { name: "53k", value: 45 },
    { name: "54k", value: 42 },
    { name: "55k", value: 55 },
    { name: "56k", value: 52 },
    { name: "57k", value: 57 },
    { name: "58k", value: 55 },
    { name: "59k", value: 52 },
    { name: "60k", value: 55 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {showDateFilter && (
          <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            {selectedPeriod}
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-91 **:outline-none [&_*:focus]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              interval="preserveStartEnd"
              tickCount={12}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              ticks={[20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            {/* Use external CustomTooltip */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#colorValue)"
              dot={{ fill: "#3B82F6", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#3B82F6", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
