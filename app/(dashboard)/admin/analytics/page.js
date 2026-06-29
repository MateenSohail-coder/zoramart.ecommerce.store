"use client";

import * as React from "react";

import StatsCard from "../../_components/StatsCard";
import AnalyticsRevenueOrdersChart from "../../_components/AnalyticsRevenueOrdersChart";

import { useGetAdminAnalyticsQuery } from "@/features/analytics/analyticsApi";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function AdminAnalyticsChartsPage() {
  const { data, isLoading } = useGetAdminAnalyticsQuery({ days: 30 });

  const totals = data?.totals;

  return (
    <div className="space-y-6 font-dmsans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Revenue, orders, and performance insights (last 30 days)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatsCard
              title="Revenue (GMV)"
              value={
                totals ? `₹ ${formatMoney(totals.revenue)}` : "—"
              }
              hint="Total revenue from paid orders"
            />

            <StatsCard
              title="AOV"
              value={
                totals ? `₹ ${formatMoney(totals.aov)}` : "—"
              }
              hint="Average order value"
            />

            <StatsCard
              title="Refund Rate"
              value={
                totals ? `${totals.refundRate.toFixed(1)}%` : "—"
              }
              hint="Refunded / total payments"
            />
          </>
        )}
      </div>

      {/* Chart */}
      <Card className="border-primary/10 shadow-sm">
        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-primary">
              Revenue & Orders Trend
            </h2>
            <p className="text-sm text-muted-foreground">
              Daily performance overview for the selected period
            </p>
          </div>

          {isLoading ? (
            <Skeleton className="h-[320px] w-full rounded-xl" />
          ) : (
            <AnalyticsRevenueOrdersChart data={data?.chart} />
          )}
        </div>
      </Card>
    </div>
  );
}