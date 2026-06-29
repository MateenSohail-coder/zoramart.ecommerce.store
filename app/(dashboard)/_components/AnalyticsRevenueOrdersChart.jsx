"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

function formatMoney(value) {
  const n = Number(value);

  if (!Number.isFinite(n)) return "0";

  return n.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export default function AnalyticsRevenueOrdersChart({ data }) {
  const chartData = Array.isArray(data) ? data : [];

  const config = {
    revenue: {
      label: "Revenue",
      color: "#ff6f00",
    },
    orders: {
      label: "Orders",
      color: "#64748b",
    },
  };

  return (
    <ChartContainer
      id="seller-analytics"
      config={config}
      className="h-[380px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6f00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff6f00" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            className="stroke-border"
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={24}
            tickFormatter={(value) => String(value).slice(5)}
            className="text-xs"
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            className="text-xs"
          />

          <ChartTooltip
            cursor={{
              stroke: "#ff6f00",
              strokeDasharray: "4 4",
            }}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name) => {
                  if (String(name).toLowerCase() === "revenue") {
                    return [`Rs ${formatMoney(value)}`, "Revenue"];
                  }

                  return [value, "Orders"];
                }}
              />
            }
          />

          <ChartLegend content={<ChartLegendContent />} />

          <Area
            type="monotone"
            dataKey="revenue"
            fill="url(#revenueGradient)"
            stroke="#ff6f00"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#ff6f00",
            }}
          />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#64748b"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
