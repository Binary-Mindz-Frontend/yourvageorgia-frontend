"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface RevenueItem {
  month: string;
  revenue1: number;
  revenue2: number;
}

interface RevenueChartProps {
  title?: string;
  data?: RevenueItem[];
  showDateFilter?: boolean;
}

// --------------------
// Move CustomTooltip outside the component
// --------------------
type FixedTooltipProps = TooltipProps<ValueType, NameType> & {
  label?: string;
  payload?: {
    color: string;
    name: string;
    value: number;
  }[];
};

const CustomTooltip: React.FC<FixedTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-xs text-gray-500 mb-1 font-semibold">{label}</p>
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <p className="text-sm font-medium">{item.name}:</p>
            <p className="text-sm font-bold" style={{ color: item.color }}>
              ${Number(item.value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --------------------

const RevenueChart = ({
  title = "Total Revenue",
  data,
  showDateFilter = true,
}: RevenueChartProps) => {
  const [selectedPeriod] = useState("Today");

  const defaultData: RevenueItem[] = [
    { month: "Jan", revenue1: 12000, revenue2: 22000 },
    { month: "Feb", revenue1: 18000, revenue2: 30000 },
    { month: "Mar", revenue1: 17000, revenue2: 10000 },
    { month: "Apr", revenue1: 15000, revenue2: 18000 },
    { month: "May", revenue1: 25000, revenue2: 40000 },
    { month: "Jun", revenue1: 38753, revenue2: 22000 },
    { month: "Jul", revenue1: 30000, revenue2: 35000 },
    { month: "Aug", revenue1: 18000, revenue2: 38000 },
    { month: "Sep", revenue1: 20000, revenue2: 35000 },
    { month: "Oct", revenue1: 23000, revenue2: 12657 },
    { month: "Nov", revenue1: 25000, revenue2: 22000 },
    { month: "Dec", revenue1: 24000, revenue2: 35000 },
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
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#F3F4F6" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            {/* Use external CustomTooltip */}
            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine x="Jun" stroke="#CBD5E1" strokeDasharray="3 3" />
            <ReferenceLine x="Oct" stroke="#CBD5E1" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="revenue1"
              name="Revenue Line 1"
              stroke="#3B82F6"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="revenue2"
              name="Revenue Line 2"
              stroke="#EF4444"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
