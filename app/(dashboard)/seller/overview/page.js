"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { useGetProductsQuery } from "@/features/product/productApi";
import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useGetSellerInfoQuery } from "@/features/sellerInfo/sellerInfoApi";
import StatsCard from "../../_components/StatsCard";

export default function SellerDashboardHome() {
  const { data: ordersData } = useGetOrdersQuery({ page: 1, limit: 5 });
  const orders = ordersData?.orders || [];
  const { data: productsData } = useGetProductsQuery({ page: 1, limit: 1 });
  const totalProducts = productsData?.total ?? 0;
  const { data: sellerInfo } = useGetSellerInfoQuery();

  return (
    <div className="space-y-6 font-dmsans">
      <Card className="rounded-sm border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold font-sora">
              Welcome back{sellerInfo?.storeName ? `, ${sellerInfo.storeName}` : ""}
            </h1>
            <p className="mt-1 text-orange-100">
              Manage your products, track orders, and grow your business.
            </p>
          </div>
          <TrendingUp size={50} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Products" value={totalProducts} hint="Listed products" icon={Package} />
        <StatsCard title="Orders" value={orders.length} hint="All orders" icon={ShoppingCart} />
        <StatsCard title="Store Rating" value={sellerInfo?.rating ?? "N/A"} hint="Average rating" icon={Star} />
      </div>

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">#{order._id?.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm capitalize">{order.orderStatus}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
