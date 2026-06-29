"use client";

import * as React from "react";
import { useGetOrdersQuery } from "@/features/order/orderApi";

import SimpleTable from "../../_components/SimpleTable";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SellerOrdersPage() {
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const orders = ordersData?.orders || [];

  const rows = orders.map((o) => ({
    _id: o._id,
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString() : "-",
    status: o.orderStatus || o.status || "-",
    amount: o.totalAmount ?? o.amount ?? "-",
    buyer: o.buyer?.name || o.buyer?.email || o.userId || "-",
  }));

  const getStatusBadge = (status) => {
    const s = String(status).toLowerCase();

    if (s === "paid" || s === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (s === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (s === "failed" || s === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6 font-dmsans">
      {/* HEADER */}
      <div className="rounded-sm border bg-[#ff6f00] p-5 text-white">
        <h1 className="text-xl font-semibold">Orders Management</h1>
        <p className="text-xs text-white/80">
          Track and manage all your customer orders
        </p>
      </div>

      {/* TABLE CARD */}
      <Card className="rounded-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-sm" />
              ))}
            </div>
          ) : (
            <SimpleTable
              columns={[
                {
                  key: "_id",
                  label: "Order ID",
                  render: (r) => (
                    <span className="font-medium">
                      #{String(r._id).slice(-8)}
                    </span>
                  ),
                },

                {
                  key: "createdAt",
                  label: "Date",
                },

                {
                  key: "buyer",
                  label: "Buyer",
                  render: (r) => (
                    <span className="text-gray-700">{r.buyer}</span>
                  ),
                },

                {
                  key: "status",
                  label: "Status",
                  render: (r) => (
                    <Badge className={getStatusBadge(r.status)}>
                      {r.status}
                    </Badge>
                  ),
                },

                {
                  key: "amount",
                  label: "Amount",
                  render: (r) => (
                    <span className="font-medium text-gray-900">
                      Rs {r.amount}
                    </span>
                  ),
                },
              ]}
              rows={rows}
              emptyText="No orders found."
            />
          )}
        </CardContent>
      </Card>

      {/* FOOT NOTE */}
      <p className="text-xs text-gray-500">
        Platform-grade sellers should only see their own orders.
      </p>
    </div>
  );
}
