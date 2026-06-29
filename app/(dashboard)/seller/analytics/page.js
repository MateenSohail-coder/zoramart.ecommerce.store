"use client";

import * as React from "react";
import { ShoppingCart, Wallet, RotateCcw, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";

import AnalyticsRevenueOrdersChart from "../../_components/AnalyticsRevenueOrdersChart";
import { useGetSellerAnalyticsQuery } from "@/features/analytics/analyticsApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";

  return n.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export default function SellerAnalyticsPage() {
  const { data: session } = useSession();
  const { data, isLoading } = useGetSellerAnalyticsQuery({
    days: 30,
    sellerId: session?.user?.id,
  });

  const totals = data?.totals;

  const stats = [
    {
      title: "Orders",
      value: totals?.orders ?? 0,
      icon: ShoppingCart,
      subtitle: "Orders in last 30 days",
    },
    {
      title: "Revenue",
      value: totals ? `Rs ${formatMoney(totals.revenue)}` : "—",
      icon: Wallet,
      subtitle: "Total earnings",
    },
    {
      title: "Refund Rate",
      value: totals ? `${totals.refundRate.toFixed(1)}%` : "—",
      icon: RotateCcw,
      subtitle: "Customer refunds",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="rounded-sm font-dmsans  border bg-[#ff6f00] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-3">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold font-sora">Seller Analytics</h1>

            <p className="text-sm ">
              Track revenue, orders and business performance.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="overflow-hidden ">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.title}
                    </p>

                    {isLoading ? (
                      <Skeleton className="mt-2 h-8 w-24" />
                    ) : (
                      <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
                    )}

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="rounded-xl p-3">
                    <Icon className="h-6 w-6 text-[#ff6f00]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#ff6f00]" />
            Revenue & Orders Overview
          </CardTitle>

          <CardDescription>Performance during the last 30 days</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <AnalyticsRevenueOrdersChart data={data?.chart} />
        </CardContent>
      </Card>
    </div>
  );
}
