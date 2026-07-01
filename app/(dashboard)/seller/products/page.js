"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  useGetProductsQuery,
  useDeleteProductsMutation,
  useUpdateProductsMutation,
} from "@/features/product/productApi";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import SimpleTable from "../../_components/SimpleTable";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function SellerProductsPage() {
  const { data: session } = useSession();
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const { data, isLoading } = useGetProductsQuery(
    {
      page,
      limit,
      sellerId: session?.user?.id,
    },
    { skip: !session?.user?.id },
  );

  const products = data?.products || [];

  const [deleteProduct] = useDeleteProductsMutation();
  const [updateProduct] = useUpdateProductsMutation();
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRestock = async (p) => {
    await updateProduct({
      id: p._id,
      stock: (p.stock ?? 0) + 10,
    });
  };

  return (
    <div className="space-y-6 font-dmsans">
      {/* HEADER (Daraz-style solid brand block) */}
      <div className="rounded-sm border bg-[#ff6f00] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="mt-1 text-sm text-white/80">
              Manage your inventory, pricing and listings
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/seller/products/new"
              className="rounded-sm  text-[#ff6f00] flex gap-3 items-center justify-center bg-white hover:bg-white/90 cursor-pointer active:scale-[0.96] px-4 py-2 text-sm font-medium"
            >
              <Plus />
              Add Product
            </Link>
            <div className="rounded-sm bg-white/20 px-4 py-2 text-sm font-medium">
              {products.length} Items
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <Card className="rounded-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="text-sm text-gray-600">Page {page}</div>

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

      {/* CONTENT */}
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
                  label: "Name",
                  render: (row) => (
                    <span className="font-medium text-black dark:text-white">
                      {row.name}
                    </span>
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
                    <span className="text-black dark:text-white">
                      Rs {row.price ?? "-"}
                    </span>
                  ),
                },

                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestock(row)}
                        className="border-[#ff6f00] text-[#ff6f00] hover:bg-[#ff6f00] hover:text-white"
                      >
                        Restock +10
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="border-gray-300"
                      >
                        <a href={`/seller/products/${row._id}/edit`}>Edit</a>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => setDeleteTarget(row._id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
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
              emptyText="No products found."
            />
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
