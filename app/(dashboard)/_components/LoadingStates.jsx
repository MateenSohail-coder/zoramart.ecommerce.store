"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton() {
  return (
    <Card className="border-border bg-card p-4">
      <Skeleton className="h-4 w-28" />
      <div className="mt-3 flex items-end gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <Card className="border-border bg-card p-4">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 ml-auto" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="border-border bg-card p-4">
      <Skeleton className="h-64 w-full" />
    </Card>
  );
}
