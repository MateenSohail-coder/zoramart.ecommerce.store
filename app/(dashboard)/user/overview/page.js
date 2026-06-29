"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, Star, Package } from "lucide-react";

import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useGetProductsQuery } from "@/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard";

export default function UserDashboardHome() {
  const { data: ordersData } = useGetOrdersQuery();
  const orders = ordersData?.orders || [];
  const { data: productsData } = useGetProductsQuery({
    page: 1,
    limit: 6,
  });

  const products = productsData?.products || [];
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-6 font-dmsans">
      {/* Welcome Banner */}

      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white shadow-md">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold font-sora">Welcome Back </h1>
            <p className="mt-1 text-orange-100">
              Track orders, manage wishlist and discover new products.
            </p>
          </div>

          <ShoppingBag size={50} />
        </CardContent>
      </Card>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-sm">
          <CardContent className="p-5">
            <Package className="mb-2 h-6 w-6 text-[#ff6f00]" />
            <p className="text-sm text-muted-foreground">Orders</p>
            <h2 className="text-2xl font-bold">{orders.length}</h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <Heart className="mb-2 h-6 w-6 text-[#ff6f00]" />
            <p className="text-sm text-muted-foreground">Wishlist</p>
            <h2 className="text-2xl font-bold">0</h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <Star className="mb-2 h-6 w-6 text-[#ff6f00]" />
            <p className="text-sm text-muted-foreground">Reviews</p>
            <h2 className="text-2xl font-bold">0</h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <ShoppingBag className="mb-2 h-6 w-6 text-[#ff6f00]" />
            <p className="text-sm text-muted-foreground">Recommended</p>
            <h2 className="text-2xl font-bold">{products.length}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders */}

        <Card className="rounded-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>

          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">#{order._id.slice(-6)}</p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge className="rounded-sm bg-[#ff6f00]">
                      Processing
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products */}

        <Card className="rounded-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recommended Products</CardTitle>

            <Link href="/products">
              <Button size="sm" variant="outline" className="rounded-sm">
                View All
              </Button>
            </Link>
          </CardHeader>

          <Separator />

          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product?._id}
                  id={product?._id}
                  slug={product?.slug}
                  name={product?.name}
                  price={product?.price}
                  originalPrice={product?.downprice}
                  image={product?.images?.[0]}
                  rating={product?.rating || 4.5}
                  reviews={product?.reviews || 0}
                  badge="Bestseller"
                  sold={product?.sold || 0}
                  inStock={product?.stock > 0}
                  description={product?.description}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
