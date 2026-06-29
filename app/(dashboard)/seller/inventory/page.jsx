"use client";

import * as React from "react";
import {
  useGetProductsQuery,
  useUpdateProductsMutation,
} from "@/features/product/productApi";

import SimpleTable from "../../_components/SimpleTable";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SellerInventoryPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isLoading } = useGetProductsQuery({
    page,
    limit,
    inStock: true,
  });

  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductsMutation();

  const products = data?.products || [];

  const handleAdjustStock = async (row, delta) => {
    const currentStock = Number(row.stock ?? 0);

    const newStock = Math.max(0, currentStock + delta);

    await updateProduct({
      id: row._id,
      stock: newStock,
    });
  };

  return (
    <div className="space-y-6 font-dmsans">
      {/* HEADER */}
      <div className="rounded-sm border bg-[#ff6f00] p-5 text-white">
        <h1 className="text-xl font-semibold">Inventory Management</h1>

        <p className="text-xs text-white/80">
          Manage stock levels and product availability
        </p>
      </div>

      {/* PAGINATION BAR */}
      <Card className="rounded-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">Page {page}</div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="rounded-sm">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-sm" />
              ))}
            </div>
          ) : (
            <SimpleTable
              columns={[
                {
                  key: "name",
                  label: "Product",
                  render: (row) => (
                    <span className="font-medium">{row.name}</span>
                  ),
                },

                {
                  key: "stock",
                  label: "Stock",
                  render: (row) => (
                    <Badge
                      className={
                        row.stock > 10
                          ? "bg-green-100 text-green-700"
                          : row.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }
                    >
                      {row.stock ?? 0}
                    </Badge>
                  ),
                },

                {
                  key: "price",
                  label: "Price",
                  render: (row) => (
                    <span className="text-gray-700">Rs {row.price}</span>
                  ),
                },

                {
                  key: "actions",
                  label: "Adjust Stock",
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleAdjustStock(row, +5)}
                        className="bg-[#ff6f00] hover:bg-[#e66000] text-white"
                      >
                        +5
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => handleAdjustStock(row, -5)}
                        className="border-[#ff6f00] text-[#ff6f00] hover:bg-[#ff6f00] hover:text-white"
                      >
                        -5
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isUpdating}
                        onClick={() => handleAdjustStock(row, -999999)}
                      >
                        Set 0
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={products.map((p) => ({
                _id: p._id,
                name: p.name,
                stock: p.stock ?? 0,
                price: p.price ?? "-",
              }))}
              emptyText="No inventory items found."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
