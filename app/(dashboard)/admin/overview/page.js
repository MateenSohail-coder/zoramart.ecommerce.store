"use client";

import * as React from "react";
import {
  Package,
  ShoppingCart,
  CreditCard,
  Star,
  TrendingUp,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useGetProductsQuery } from "@/features/product/productApi";
import { useGetPaymentsQuery } from "@/features/payment/paymentApi";
import { useGetReviewsQuery } from "@/features/reviews/reviewsApi";

import StatsCard from "../../_components/StatsCard";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsPage() {
  const {
    data: ordersData,
    isLoading: ordersLoading,
  } = useGetOrdersQuery();
  const orders = ordersData?.orders || [];

  const {
    data: productsData,
    isLoading: productsLoading,
  } = useGetProductsQuery({
    page: 1,
    limit: 1,
  });

  const {
    data: payments = [],
    isLoading: paymentsLoading,
  } = useGetPaymentsQuery();

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
  } = useGetReviewsQuery();

  const isLoading =
    ordersLoading ||
    productsLoading ||
    paymentsLoading ||
    reviewsLoading;

  const totalProducts =
    productsData?.total ??
    productsData?.products?.length ??
    0;

  const totalRevenue = payments.reduce(
    (sum, payment) =>
      sum + (payment.amount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered"
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + (review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56 rounded-xl" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 rounded-2xl"
            />
          ))}
        </div>

        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-sora font-medium ">
          Dashboard Overview
        </h1>

        <p className="text-muted-foreground font-dmsans">
          Monitor platform performance,
          sales, orders and customer activity.
        </p>
      </div>

      {/* Main Stats */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          hint="Products available"
          icon={Package}
        />

        <StatsCard
          title="Orders"
          value={orders.length}
          hint="All orders"
          icon={ShoppingCart}
        />

        <StatsCard
          title="Payments"
          value={payments.length}
          hint="Successful payments"
          icon={CreditCard}
        />

        <StatsCard
          title="Reviews"
          value={reviews.length}
          hint="Customer reviews"
          icon={Star}
        />
      </div>

      {/* Secondary Stats */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 opacity-80" />

              <span className="text-xs font-medium uppercase">
                Revenue
              </span>
            </div>

            <h3 className="mt-4 text-3xl font-bold">
              Rs {totalRevenue.toLocaleString()}
            </h3>

            <p className="mt-2 text-sm text-white/80">
              Total collected revenue
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Clock3 className="h-8 w-8 opacity-80" />
            </div>

            <h3 className="mt-4 text-3xl font-bold">
              {pendingOrders}
            </h3>

            <p className="mt-2 text-sm text-white/80">
              Pending Orders
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="h-8 w-8 opacity-80" />
            </div>

            <h3 className="mt-4 text-3xl font-bold">
              {deliveredOrders}
            </h3>

            <p className="mt-2 text-sm text-white/80">
              Delivered Orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>
              Platform Insights
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Average Rating</span>

              <span className="font-semibold">
                ⭐ {averageRating}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Conversion Rate</span>

              <span className="font-semibold">
                {orders.length > 0
                  ? (
                      (payments.length /
                        orders.length) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Order Completion</span>

              <span className="font-semibold">
                {orders.length > 0
                  ? (
                      (deliveredOrders /
                        orders.length) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>
              Quick Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • {totalProducts} products
              currently listed.
            </p>

            <p>
              • {orders.length} orders have
              been placed.
            </p>

            <p>
              • Rs{" "}
              {totalRevenue.toLocaleString()}
              generated through payments.
            </p>

            <p>
              • Customers submitted{" "}
              {reviews.length} reviews with an
              average rating of {averageRating}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}