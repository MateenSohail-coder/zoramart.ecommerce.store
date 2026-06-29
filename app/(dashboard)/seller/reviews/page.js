"use client";

import Link from "next/link";
import * as React from "react";
import { useGetReviewsQuery } from "@/features/reviews/reviewsApi";

import SimpleTable from "../../_components/SimpleTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Star, MessageSquare, Package, TrendingUp } from "lucide-react";

export default function SellerReviewsPage() {
  const { data: session, status } = require("next-auth/react").useSession();
  const sellerId = session?.user?.id;

  const { data: reviews, isLoading } = useGetReviewsQuery(undefined, {
    skip: status !== "authenticated" || !sellerId,
  });

  const rows = (reviews || []).map((r) => ({
    _id: r._id,
    product: r.product || null,
    rating: r.rating ?? 0,
    comment: r.comment ?? r.text ?? "-",
    user: r.user || null,
  }));

  const averageRating =
    reviews?.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + (Number(review.rating) || 0),
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0";

  const SkeletonStats = () => (
    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const SkeletonTable = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
      </CardHeader>

      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 rounded-md border p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sora font-medium ">
          Product Reviews
        </h1>
        <p className="text-muted-foreground font-dmsans">
          Monitor customer feedback and product ratings.
        </p>
      </div>

      {isLoading ? (
        <>
          <SkeletonStats />
          <SkeletonTable />
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-3xl font-bold">{reviews?.length || 0}</p>
                </div>
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-3xl font-bold">{averageRating}</p>
                </div>
                <Star className="h-10 w-10 text-yellow-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Rated Products
                  </p>
                  <p className="text-3xl font-bold">
                    {new Set(reviews?.map((r) => r.productId)).size || 0}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                Reviews submitted by customers for your products.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SimpleTable
                columns={[
                  {
                    key: "product",
                    label: "Product",
                    render: (row) =>
                      row.product ? (
                        <Link
                          href={`/product?id=${row.product._id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {row.product.name || `#${String(row.product._id).slice(0, 8)}`}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      ),
                  },
                  {
                    key: "rating",
                    label: "Rating",
                    render: (row) => (
                      <Badge variant="secondary">⭐ {row.rating}</Badge>
                    ),
                  },
                  {
                    key: "comment",
                    label: "Comment",
                    render: (row) => (
                      <span className="line-clamp-2 max-w-md">
                        {row.comment}
                      </span>
                    ),
                  },
                  {
                    key: "user",
                    label: "Customer",
                    render: (row) => (
                      <span className="text-muted-foreground">
                        {row.user?.name || row.user?.email || "—"}
                      </span>
                    ),
                  },
                ]}
                rows={rows}
                emptyText="No reviews found."
              />
            </CardContent>
          </Card>

          {!rows.length && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No Reviews Yet</h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Customer reviews will appear here once buyers start leaving
                  feedback on your products.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
