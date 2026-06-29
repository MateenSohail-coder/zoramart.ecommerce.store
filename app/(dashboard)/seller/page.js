"use client";

import * as React from "react";
import { useGetProductsQuery } from "@/features/product/productApi";
import { useGetOrdersQuery } from "@/features/order/orderApi";
import StatsCard from "../_components/StatsCard";

export default function SellerOverviewPage() {
  const { data: productsData } = useGetProductsQuery({ page: 1, limit: 1 });
  const { data: ordersData } = useGetOrdersQuery();
  const orders = ordersData?.orders || [];

  const totalProducts =
    productsData?.total ?? productsData?.products?.length ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Seller Overview</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          title="My Products"
          value={totalProducts}
          hint="From GET /products"
        />
        <StatsCard
          title="My Orders"
          value={orders?.length || 0}
          hint="From GET /order"
        />
        <StatsCard title="Shop Status" value={"Active"} hint="Demo" />
      </div>

      <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
        Platform-grade sellers need per-user filtering (only own
        products/orders). Current backend endpoints return global lists.
      </div>
    </div>
  );
}
