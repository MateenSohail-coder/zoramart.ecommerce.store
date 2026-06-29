"use client";

import * as React from "react";
import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useGetProductsQuery } from "@/features/product/productApi";
import { useGetPaymentsQuery } from "@/features/payment/paymentApi";
import { useGetReviewsQuery } from "@/features/reviews/reviewsApi";
import StatsCard from "../_components/StatsCard";

export default function AdminAnalyticsPage() {
  const { data: ordersData } = useGetOrdersQuery();
  const orders = ordersData?.orders || [];
  const { data: productsData } = useGetProductsQuery({ page: 1, limit: 1 });
  const { data: payments } = useGetPaymentsQuery();
  const { data: reviews } = useGetReviewsQuery();

  const totalProducts =
    productsData?.total ?? productsData?.products?.length ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Admin Analytics</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatsCard
          title="Products"
          value={totalProducts}
          hint="From GET /products"
        />
        <StatsCard
          title="Orders"
          value={orders?.length || 0}
          hint="From GET /order"
        />
        <StatsCard
          title="Payments"
          value={payments?.length || 0}
          hint="From GET /payment"
        />
        <StatsCard
          title="Reviews"
          value={reviews?.length || 0}
          hint="From GET /reviews"
        />
      </div>

      <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
        Charts/advanced analytics are intentionally lightweight here.
        Platform-grade UX would add filters, date ranges, and server-side
        aggregates.
      </div>
    </div>
  );
}
