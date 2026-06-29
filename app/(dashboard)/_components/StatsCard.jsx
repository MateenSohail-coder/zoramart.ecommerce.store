"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function StatsCard({
  title,
  value,
  hint,
  delta,
  badge,
  className,
}) {
  const isPositive = delta !== undefined && delta !== null && delta >= 0;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="md:text-xl text-sm font-sora font-medium dark:text-white text-foreground tracking-tight">
            {title}
          </CardTitle>
          {hint && (
            <CardDescription className="text-xs">{hint}</CardDescription>
          )}
        </div>
        {badge && (
          <Badge variant="secondary" className="font-medium shadow-sm">
            {badge}
          </Badge>
        )}
      </CardHeader>

      <CardContent
        className={cn(
          "pb-2",
          (delta === undefined || delta === null) && "pb-6",
        )}
      >
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value ?? "—"}
        </div>
      </CardContent>

      {delta !== undefined && delta !== null && (
        <CardFooter className="pt-0 text-xs text-muted-foreground flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium rounded-md px-1.5 py-0.5",
              isPositive
                ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50"
                : "text-destructive bg-destructive/10",
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {isPositive ? "+" : ""}
            {delta}%
          </span>
          <span>vs last period</span>
        </CardFooter>
      )}
    </Card>
  );
}
