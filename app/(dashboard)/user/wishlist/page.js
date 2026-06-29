"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { useGetProductsQuery } from "@/features/product/productApi";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const KEY = "zoraMart:user:wishlist";

export default function UserWishlistPage() {
  const [wishlist, setWishlist] = React.useState([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem(KEY) || "[]");

    setWishlist(items);
    setHydrated(true);
  }, []);

  const wishlistIds = wishlist.map((item) => item._id).filter(Boolean);

  const { data: productsData, isFetching } = useGetProductsQuery({
    page: 1,
    limit: 50,
    search: "",
  });

  const allProducts = productsData?.products || [];

  const products = wishlistIds.length
    ? allProducts.filter((product) =>
        wishlistIds.some((id) => String(id) === String(product._id)),
      )
    : wishlist;

  const removeFromWishlist = (productId) => {
    const next = wishlist.filter(
      (item) => String(item._id) !== String(productId),
    );

    setWishlist(next);

    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>

            <p className="text-orange-100">Save products for later</p>
          </div>

          <Heart className="h-12 w-12" />
        </CardContent>
      </Card>

      {/* Stats */}

      <Card className="rounded-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Saved Products</span>

            <Badge className="rounded-sm bg-[#ff6f00]">{products.length}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}

      {!hydrated ? (
        <Card className="rounded-sm">
          <CardContent className="p-10 text-center">
            Loading wishlist...
          </CardContent>
        </Card>
      ) : isFetching ? (
        <Card className="rounded-sm">
          <CardContent className="p-10 text-center">
            Resolving wishlist...
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card className="rounded-sm">
          <CardContent className="flex flex-col items-center py-20">
            <Heart className="mb-4 h-16 w-16 text-muted-foreground" />

            <h3 className="text-xl font-semibold">Wishlist is Empty</h3>

            <p className="mt-2 text-muted-foreground">
              Save products and they will appear here.
            </p>

            <Link href="/products">
              <Button className="mt-5 rounded-sm bg-[#ff6f00] hover:bg-[#e66400]">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product._id}
              className="group overflow-hidden rounded-sm transition-all hover:shadow-lg"
            >
              {/* Product Image */}

              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-2 rounded-sm"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {/* Content */}

              <CardContent className="p-4">
                <h3 className="line-clamp-2 min-h-[48px] text-sm font-medium">
                  {product.name}
                </h3>

                <div className="mt-3 text-xl font-bold text-[#ff6f00]">
                  Rs. {product.price}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 rounded-sm bg-[#ff6f00] hover:bg-[#e66400]">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-sm"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
