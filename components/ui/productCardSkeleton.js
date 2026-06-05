import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="group overflow-hidden rounded-xs border border-border/50 bg-background font-dmsans shadow-sm">
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="relative aspect-square bg-muted">
          <Skeleton>
            {" "}
            <div className="absolute h-full w-full flex items-center justify-center">
              <img
                src="/zMartDark.png"
                className="md:h-15 md:w-40 h-10 w-30  grayscale opacity-20"
                alt=""
              />
            </div>
          </Skeleton>
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Badge */}
        <Skeleton className="absolute left-2 top-2 h-5 w-14 rounded-sm bg-white/20" />

        {/* Discount */}
        <Skeleton className="absolute right-2 top-2 h-5 w-16 rounded-sm bg-white/20" />
      </div>

      {/* Content */}
      <CardContent className="space-y-2 p-2">
        {/* Title */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-3/4 rounded-sm" />
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-5/6 rounded-sm" />
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-3.5 w-3.5 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-3 w-6 rounded-sm" />
          </div>

          <Skeleton className="h-3 w-10 rounded-sm" />
        </div>

        {/* Sold */}
        <Skeleton className="h-3 w-16 rounded-sm" />

        {/* Price */}
        <div className="flex items-end gap-2">
          <Skeleton className="h-6 w-16 rounded-sm" />
          <Skeleton className="h-3 w-12 rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );
}
