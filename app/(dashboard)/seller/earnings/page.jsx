"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  DollarSign,
  Clock3,
  Landmark,
  TrendingUp,
} from "lucide-react";

export default function SellerEarningsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">
          Monitor your revenue, pending balances, and payouts.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Earnings
              </p>
              <p className="text-3xl font-bold">—</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Balance
              </p>
              <p className="text-3xl font-bold">—</p>
            </div>
            <Clock3 className="h-10 w-10 text-amber-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Payouts
              </p>
              <p className="text-3xl font-bold">—</p>
            </div>
            <Landmark className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Revenue Growth
              </p>
              <p className="text-3xl font-bold">—</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Earnings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Summary</CardTitle>
          <CardDescription>
            Overview of seller revenue and payout activity.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="mb-4 h-14 w-14 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              Earnings Data Not Available
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Earnings calculations, payout tracking, and finance aggregation
              have not yet been connected to the backend.
            </p>

            <Badge variant="secondary" className="mt-4">
              Backend Integration Pending
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Future Payout Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payouts</CardTitle>
          <CardDescription>
            Scheduled transfers to your payment account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No payout records available.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}