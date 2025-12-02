"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

// -------------------
// Types
// -------------------
interface ServiceItem {
  month: string;
  value: number;
}

interface ServiceChartProps {
  title?: string;
  growthLabel?: string;
  growthPercentage?: string;
  data?: ServiceItem[];
  showYearFilter?: boolean;
}

// Custom tooltip prop types (manual — this FIXES TS errors)
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
  }[];
  label?: string;
}

// -------------------
// Move CustomTooltip OUTSIDE the component
// -------------------
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ServiceChart: React.FC<ServiceChartProps> = ({
  title = "Service Overview",
  growthLabel = "Overly Growth",
  growthPercentage = "35.80%",
  data,
  showYearFilter = true,
}) => {
  const [selectedYear] = useState("2024");

  const defaultData: ServiceItem[] = [
    { month: "Jan", value: 75 },
    { month: "Feb", value: 60 },
    { month: "Mar", value: 100 },
    { month: "Apr", value: 70 },
    { month: "May", value: 65 },
    { month: "Jun", value: 85 },
    { month: "July", value: 70 },
    { month: "Augst", value: 55 },
    { month: "Sep", value: 90 },
    { month: "Oct", value: 75 },
    { month: "Nov", value: 65 },
    { month: "Dec", value: 95 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400">{growthLabel}</p>
          <p className="text-sm font-medium text-blue-400">{growthPercentage}</p>
        </div>

        {showYearFilter && (
          <button className="flex items-center gap-3 px-3 py-1 text-xs text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
            {selectedYear}
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-54 **:outline-none [&_*:focus]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: -20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A6FA5" stopOpacity={1} />
                <stop offset="50%" stopColor="#6B8DC4" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#A4BFE3" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" stroke="#334155" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 14 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 14 }}
              ticks={[0, 20, 40, 60, 80, 100]}
              domain={[0, 110]}
            />

            {/* Use the external CustomTooltip */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#colorValue)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceChart;
