"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { CreditCard } from "lucide-react";
import { useGetPaymentsQuery } from "@/features/payment/paymentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SimpleTable from "../../_components/SimpleTable";

export default function UserPaymentsPage() {
  const { data: session } = useSession();
  const { data: payments = [], isLoading } = useGetPaymentsQuery(undefined, {
    skip: !session?.user,
  });

  const userPayments = payments.filter(
    (p) => String(p.user) === String(session?.user?.id),
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">Payment History</h1>
            <p className="text-orange-100">View your transaction records</p>
          </div>
          <CreditCard className="h-10 w-10" />
        </CardContent>
      </Card>

      <Card className="rounded-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <SimpleTable
              columns={[
                { key: "transactionId", label: "Transaction ID" },
                { key: "paymentMethod", label: "Method" },
                {
                  key: "amountPaid",
                  label: "Amount",
                  render: (row) => `Rs. ${Number(row.amountPaid || 0).toLocaleString()}`,
                },
                {
                  key: "paymentStatus",
                  label: "Status",
                  render: (row) => (
                    <Badge
                      className={
                        row.paymentStatus === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {row.paymentStatus}
                    </Badge>
                  ),
                },
                {
                  key: "createdAt",
                  label: "Date",
                  render: (row) =>
                    row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : "-",
                },
              ]}
              rows={userPayments}
              emptyText="No payments found."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
