"use client";

import * as React from "react";
import { Search, Package } from "lucide-react";

import { useGetOrdersQuery } from "@/features/order/orderApi";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return (
        <Badge className="rounded-sm bg-yellow-500 hover:bg-yellow-500">
          Pending
        </Badge>
      );

    case "processing":
      return (
        <Badge className="rounded-sm bg-blue-500 hover:bg-blue-500">
          Processing
        </Badge>
      );

    case "shipped":
      return (
        <Badge className="rounded-sm bg-purple-500 hover:bg-purple-500">
          Shipped
        </Badge>
      );

    case "delivered":
      return (
        <Badge className="rounded-sm bg-green-600 hover:bg-green-600">
          Delivered
        </Badge>
      );

    case "cancelled":
      return (
        <Badge className="rounded-sm bg-red-600 hover:bg-red-600">
          Cancelled
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary" className="rounded-sm">
          {status}
        </Badge>
      );
  }
};

export default function UserOrdersPage() {
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const orders = ordersData?.orders || [];

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredOrders = React.useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .filter((order) => {
        const matchesSearch = order._id
          ?.toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "all"
            ? true
            : order.orderStatus?.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [orders, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>

            <p className="text-orange-100">Track and manage your purchases</p>
          </div>

          <Package className="h-12 w-12" />
        </CardContent>
      </Card>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Orders</p>

            <h2 className="mt-1 text-3xl font-bold">{orders.length}</h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Pending</p>

            <h2 className="mt-1 text-3xl font-bold text-yellow-500">
              {
                orders.filter((o) => o.orderStatus?.toLowerCase() === "pending")
                  .length
              }
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Delivered</p>

            <h2 className="mt-1 text-3xl font-bold text-green-600">
              {
                orders.filter(
                  (o) => o.orderStatus?.toLowerCase() === "delivered",
                ).length
              }
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Cancelled</p>

            <h2 className="mt-1 text-3xl font-bold text-red-600">
              {
                orders.filter(
                  (o) => o.orderStatus?.toLowerCase() === "cancelled",
                ).length
              }
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}

      <Card className="rounded-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search order id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-sm pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-sm md:w-[220px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>

                <SelectItem value="pending">Pending</SelectItem>

                <SelectItem value="processing">Processing</SelectItem>

                <SelectItem value="shipped">Shipped</SelectItem>

                <SelectItem value="delivered">Delivered</SelectItem>

                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}

      <Card className="rounded-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{String(order._id).slice(-8)}
                    </TableCell>

                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>

                    <TableCell className="font-semibold text-[#ff6f00]">
                      Rs. {order.totalAmount ?? order.amount ?? 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
