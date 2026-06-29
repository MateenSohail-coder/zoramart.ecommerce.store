"use client";

import * as React from "react";
import {
  ShoppingCart,
  Search,
  Receipt,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";

import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
} from "@/features/order/orderApi";

import SimpleTable from "../../_components/SimpleTable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();

  const { data: ordersData, isLoading } =
    useGetOrdersQuery();
  const orders = ordersData?.orders || [];

  const [deleteOrder] = useDeleteOrderMutation();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteOrder(deleteTarget);
      toast.success("Order deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredOrders = React.useMemo(() => {
    let result = [...orders];

    if (search) {
      result = result.filter((order) => {
        const customer =
          order.userId ||
          order.customer ||
          "";

        return (
          String(order._id)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          String(customer)
            .toLowerCase()
            .includes(search.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (order) =>
          order.status?.toLowerCase() ===
          statusFilter
      );
    }

    return result;
  }, [orders, search, statusFilter]);

  const totalOrders = orders.length;

  const pendingOrders =
    orders.filter(
      (o) =>
        o.status?.toLowerCase() ===
        "pending"
    ).length || 0;

  const deliveredOrders =
    orders.filter(
      (o) =>
        o.status?.toLowerCase() ===
        "delivered"
    ).length || 0;

  const cancelledOrders =
    orders.filter(
      (o) =>
        o.status?.toLowerCase() ===
        "cancelled"
    ).length || 0;

  const rows = filteredOrders.map((o) => ({
    _id: o._id,
    customer:
      o.userId ||
      o.customer ||
      "Customer",

    status:
      o.status || "Pending",

    amount:
      o.totalAmount ??
      o.amount ??
      0,

    createdAt: o.createdAt
      ? new Date(
          o.createdAt
        ).toLocaleDateString()
      : "-",
  }));

  return (
    <div className="space-y-6 font-dmsans">
      {/* Hero Section */}
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Orders Management
              </h1>

              <p className="mt-2 text-muted-foreground">
                Track, manage and monitor
                customer orders across
                your marketplace.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 shadow-sm">
              <ShoppingCart className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Orders
                </p>

                <p className="font-bold">
                  {totalOrders}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Orders
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {totalOrders}
                </h3>
              </div>

              <div className="rounded-2xl bg-primary/10 p-3">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending
                </p>

                <h3 className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingOrders}
                </h3>
              </div>

              <div className="rounded-2xl bg-yellow-500/10 p-3">
                <Clock3 className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Delivered
                </p>

                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {deliveredOrders}
                </h3>
              </div>

              <div className="rounded-2xl bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Cancelled
                </p>

                <h3 className="mt-2 text-3xl font-bold text-red-500">
                  {cancelledOrders}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-500/10 p-3">
                <XCircle className="h-6 w-6 text-red-500" />
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
                placeholder="Search order ID or customer..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={
                setStatusFilter
              }
            >
              <SelectTrigger className="w-full lg:w-[220px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Orders
                </SelectItem>

                <SelectItem value="pending">
                  Pending
                </SelectItem>

                <SelectItem value="delivered">
                  Delivered
                </SelectItem>

                <SelectItem value="cancelled">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
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
                  key: "_id",
                  label: "Order ID",
                  render: (
                    row
                  ) => (
                    <span className="font-medium">
                      #
                      {String(
                        row._id
                      ).slice(-8)}
                    </span>
                  ),
                },

                {
                  key: "customer",
                  label: "Customer",
                  render: (
                    row
                  ) => (
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {String(
                            row.customer
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-medium">
                        {
                          row.customer
                        }
                      </span>
                    </div>
                  ),
                },

                {
                  key: "createdAt",
                  label: "Date",
                },

                {
                  key: "status",
                  label: "Status",
                  render: (
                    row
                  ) => {
                    const status =
                      row.status?.toLowerCase();

                    if (
                      status ===
                      "delivered"
                    ) {
                      return (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                          Delivered
                        </Badge>
                      );
                    }

                    if (
                      status ===
                      "pending"
                    ) {
                      return (
                        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10">
                          Pending
                        </Badge>
                      );
                    }

                    if (
                      status ===
                      "cancelled"
                    ) {
                      return (
                        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/10">
                          Cancelled
                        </Badge>
                      );
                    }

                    return (
                      <Badge>
                        {
                          row.status
                        }
                      </Badge>
                    );
                  },
                },

                {
                  key: "amount",
                  label: "Amount",
                  render: (
                    row
                  ) => (
                    <span className="font-semibold text-primary">
                      Rs{" "}
                      {row.amount}
                    </span>
                  ),
                },

                {
                  key: "actions",
                  label: "Actions",
                  render: (
                    row
                  ) => (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/orders/${row._id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

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
                    </div>
                  ),
                },
              ]}
              rows={rows}
              emptyText="No orders found."
            />
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}