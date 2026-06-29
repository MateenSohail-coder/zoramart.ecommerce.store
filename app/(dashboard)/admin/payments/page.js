"use client";

import * as React from "react";
import { CreditCard, Search } from "lucide-react";
import {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
} from "@/features/payment/paymentApi";
import SimpleTable from "../../_components/SimpleTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPaymentsPage() {
  const { data: payments = [], isLoading } = useGetPaymentsQuery();
  const [updatePayment] = useUpdatePaymentMutation();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    let result = [...payments];
    if (search) {
      result = result.filter(
        (p) =>
          p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
          String(p._id).includes(search),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.paymentStatus === statusFilter);
    }
    return result;
  }, [payments, search, statusFilter]);

  const handleStatusChange = async (id, paymentStatus) => {
    try {
      await updatePayment({ id, paymentStatus }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-dmsans">
      <Card className="border-primary/10 bg-gradient-to-br from-background to-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Manage all payment transactions</p>
          </div>
          <CreditCard className="h-8 w-8 text-primary" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search by transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <SimpleTable
              columns={[
                {
                  key: "transactionId",
                  label: "Transaction",
                  render: (row) => (
                    <span className="font-mono text-sm">{row.transactionId}</span>
                  ),
                },
                {
                  key: "method",
                  label: "Method",
                  render: (row) => row.paymentMethod,
                },
                {
                  key: "amount",
                  label: "Amount",
                  render: (row) => (
                    <span className="font-semibold text-primary">
                      Rs. {Number(row.amountPaid || 0).toLocaleString()}
                    </span>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => (
                    <Select
                      value={row.paymentStatus}
                      onValueChange={(v) => handleStatusChange(row._id, v)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  ),
                },
                {
                  key: "date",
                  label: "Date",
                  render: (row) =>
                    row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : "-",
                },
              ]}
              rows={filtered.map((p) => ({ ...p, _id: p._id }))}
              emptyText="No payments found."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
