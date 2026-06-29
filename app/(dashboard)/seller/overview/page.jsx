"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ShoppingCart, Star, Plus, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { useGetProductsQuery } from "@/features/product/productApi";
import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useGetReviewsQuery } from "@/features/reviews/reviewsApi";
import { useSession } from "next-auth/react";

export default function SellerOverviewPage() {
  const { data: session, status } = useSession();
  const sellerId = session?.user?.id;

  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery(
      {
        page: 1,
        limit: 5,
        sellerId,
      },
      {
        skip: status !== "authenticated" || !sellerId,
      },
    );

  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersQuery(
    {
      status: undefined,
      buyerId: sellerId,
    },
    {
      skip: status !== "authenticated" || !sellerId,
    },
  );

  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsQuery(
    undefined,
    {
      skip: status !== "authenticated" || !sellerId,
    },
  );

  const products = productsData?.products || [];
  const orders = ordersData?.orders || ordersData || [];

  const totalProducts = productsData?.total ?? products.length;
  const totalOrders = ordersData?.total ?? orders.length;
  const totalReviews =
    reviewsData?.total ??
    reviewsData?.reviews?.length ??
    reviewsData?.length ??
    0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-sora tracking-tight">
            Seller Dashboard
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage products, orders and customer feedback.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-primary-main hover:bg-primary-main/90">
            <Link href="/seller/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/seller/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Products</p>

              {productsLoading ? (
                <Skeleton className="mt-2 h-8 w-20" />
              ) : (
                <h2 className="mt-2 text-3xl font-bold">{totalProducts}</h2>
              )}
            </div>

            <div className="rounded-xl bg-primary-main/10 p-3">
              <Package className="h-6 w-6 text-[#ff6f00]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Orders</p>

              {ordersLoading ? (
                <Skeleton className="mt-2 h-8 w-20" />
              ) : (
                <h2 className="mt-2 text-3xl font-bold">{totalOrders}</h2>
              )}
            </div>

            <div className="rounded-xl bg-primary-main/10 p-3">
              <ShoppingCart className="h-6 w-6 text-[#ff6f00]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Reviews</p>

              {reviewsLoading ? (
                <Skeleton className="mt-2 h-8 w-20" />
              ) : (
                <h2 className="mt-2 text-3xl font-bold">{totalReviews}</h2>
              )}
            </div>

            <div className="rounded-xl bg-primary-main/10 p-3">
              <Star className="h-6 w-6 text-[#ff6f00]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Latest products in your store</CardDescription>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/seller/products">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {productsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No products found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        <Link
                          href={`/seller/products/${p._id}`}
                          className="font-medium hover:text-primary-main"
                        >
                          {p.name}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">{p.stock ?? 0}</Badge>
                      </TableCell>

                      <TableCell>Rs {p.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/seller/orders">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No orders found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o._id}>
                      <TableCell>
                        <Link
                          href={`/seller/orders/${o._id}`}
                          className="font-medium hover:text-primary-main"
                        >
                          #{String(o._id).slice(-6)}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{o.status || "Pending"}</Badge>
                      </TableCell>

                      <TableCell>Rs {o.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
