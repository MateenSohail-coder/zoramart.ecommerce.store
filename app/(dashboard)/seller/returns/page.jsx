"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, PackageX, Clock3, CheckCircle2 } from "lucide-react";
import SimpleTable from "../../_components/SimpleTable";

export default function SellerReturnsPage() {
  const returns = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-sora font-medium ">Returns</h1>
        <p className="text-muted-foreground font-dmsans">
          Manage customer return requests and refund statuses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Returns
              </p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <RefreshCw className="h-10 w-10 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Review
              </p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Clock3 className="h-10 w-10 text-amber-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Approved
              </p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Returns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
          <CardDescription>
            View and track all customer return requests.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SimpleTable
            columns={[
              { key: "id", label: "Return ID" },
              { key: "orderId", label: "Order ID" },
              { key: "reason", label: "Reason" },
              { key: "status", label: "Status" },
            ]}
            rows={returns}
            emptyText="No return requests found."
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {returns.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <PackageX className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">
              No Returns Yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Customer return requests will appear here once the returns
              module is connected to the backend.
            </p>

            <Badge variant="secondary" className="mt-4">
              Backend Integration Pending
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}