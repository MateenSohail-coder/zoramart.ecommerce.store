"use client";

import * as React from "react";
import Link from "next/link";

import {
  useGetReviewsQuery,
  useDeleteReviewMutation,
} from "@/features/reviews/reviewsApi";

import SimpleTable from "../../_components/SimpleTable";

import {
  Star,
  Trash2,
  Search,
  MessageSquare,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminReviewsPage() {
  const { data: reviews = [], isLoading } =
    useGetReviewsQuery();

  const [deleteReview] =
    useDeleteReviewMutation();

  const [search, setSearch] =
    React.useState("");

  const [ratingFilter, setRatingFilter] =
    React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteReview(deleteTarget);
      toast.success("Review deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredReviews = React.useMemo(() => {
    let result = [...reviews];

    if (search) {
      result = result.filter((review) => {
        const comment = review.comment || review.text || "";
        const userName = review.user?.name || review.user?.email || "";
        const productName = review.product?.name || "";

        return (
          comment.toLowerCase().includes(search.toLowerCase()) ||
          userName.toLowerCase().includes(search.toLowerCase()) ||
          productName.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (ratingFilter !== "all") {
      result = result.filter(
        (review) =>
          String(review.rating) ===
          ratingFilter
      );
    }

    return result;
  }, [
    reviews,
    search,
    ratingFilter,
  ]);

  const totalReviews = reviews.length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, item) =>
              acc +
              (item.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  const fiveStars =
    reviews.filter(
      (r) => r.rating === 5
    ).length || 0;

  const lowRatings =
    reviews.filter(
      (r) => (r.rating || 0) <= 2
    ).length || 0;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  const rows = filteredReviews.map(
    (review) => ({
      _id: review._id,
      product: review.product || null,
      user: review.user || null,
      rating: review.rating || 0,
      comment: review.comment || review.text || "-",
    })
  );

  return (
    <div className="space-y-6 font-dmsans">
      {/* Hero */}
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Reviews Management
              </h1>

              <p className="mt-2 text-muted-foreground">
                Monitor customer
                feedback, ratings and
                product reviews.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 shadow-sm">
              <MessageSquare className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Reviews
                </p>

                <p className="font-bold">
                  {totalReviews}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Reviews
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {totalReviews}
                </h3>
              </div>

              <div className="rounded-2xl bg-primary/10 p-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Average Rating
                </p>

                <h3 className="mt-2 text-3xl font-bold text-yellow-600">
                  {averageRating}
                </h3>
              </div>

              <div className="rounded-2xl bg-yellow-500/10 p-3">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  5 Star Reviews
                </p>

                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {fiveStars}
                </h3>
              </div>

              <div className="rounded-2xl bg-green-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Low Ratings
                </p>

                <h3 className="mt-2 text-3xl font-bold text-red-500">
                  {lowRatings}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-500/10 p-3">
                <Star className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>
            Search & Filters
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search reviews, users or products..."
                className="pl-10"
              />
            </div>

            <Select
              value={ratingFilter}
              onValueChange={
                setRatingFilter
              }
            >
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Ratings
                </SelectItem>

                <SelectItem value="5">
                  5 Stars
                </SelectItem>

                <SelectItem value="4">
                  4 Stars
                </SelectItem>

                <SelectItem value="3">
                  3 Stars
                </SelectItem>

                <SelectItem value="2">
                  2 Stars
                </SelectItem>

                <SelectItem value="1">
                  1 Star
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({
                length: 8,
              }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-xl"
                />
              ))}
            </div>
          ) : (
              <SimpleTable
                columns={[
                  {
                    key: "product",
                    label: "Product",
                    render: (row) =>
                      row.product ? (
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              <Package className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/product?id=${row.product._id}`}
                              className="font-medium hover:underline"
                            >
                              {row.product.name || `#${String(row.product._id).slice(-8)}`}
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      ),
                  },

                  {
                    key: "user",
                    label: "Customer",
                    render: (row) =>
                      row.user ? (
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              <Users className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {row.user.name || "Customer"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {row.user.email || ""}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      ),
                  },

                {
                  key: "rating",
                  label: "Rating",
                  render: (
                    row
                  ) => (
                    <div className="flex flex-col gap-1">
                      {renderStars(
                        row.rating
                      )}

                      <span className="text-xs text-muted-foreground">
                        {
                          row.rating
                        }
                        /5 Rating
                      </span>
                    </div>
                  ),
                },

                {
                  key: "comment",
                  label: "Review",
                  render: (
                    row
                  ) => (
                    <div className="max-w-md">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {
                          row.comment
                        }
                      </p>
                    </div>
                  ),
                },

                {
                  key: "actions",
                  label: "Actions",
                  render: (
                    row
                  ) => (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        setDeleteTarget(
                          row._id
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ),
                },
              ]}
              rows={rows}
              emptyText="No reviews found."
            />
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}