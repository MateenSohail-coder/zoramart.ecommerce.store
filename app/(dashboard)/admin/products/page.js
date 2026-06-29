"use client";

import * as React from "react";
import {
  Package,
  Trash2,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Boxes,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  useGetProductsQuery,
  useDeleteProductsMutation,
  useUpdateProductsMutation,
} from "@/features/product/productApi";

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
  AvatarImage,
} from "@/components/ui/avatar";

import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [stockFilter, setStockFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("latest");

  const limit = 10;

  const { data, isLoading } = useGetProductsQuery({
    page,
    limit,
  });

  const [deleteProduct] = useDeleteProductsMutation();
  const [updateProduct] = useUpdateProductsMutation();

  const products = data?.products || [];

  const totalProducts = data?.total || products.length;

  const inStockCount = products.filter(
    (p) => (p.stock ?? 0) > 0
  ).length;

  const outStockCount = products.filter(
    (p) => (p.stock ?? 0) <= 0
  ).length;

  const totalPages =
    Math.ceil((data?.total || 0) / limit) || 1;

  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteProduct(deleteTarget);
      toast.success("Product deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleStock = async (product) => {
    const isInStock = (product.stock ?? 0) > 0;

    try {
      await updateProduct({
        id: product._id,
        stock: isInStock ? 0 : 10,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (stockFilter === "in-stock") {
      result = result.filter(
        (product) => (product.stock ?? 0) > 0
      );
    }

    if (stockFilter === "out-stock") {
      result = result.filter(
        (product) => (product.stock ?? 0) <= 0
      );
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => (a.price || 0) - (b.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => (b.price || 0) - (a.price || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [products, search, stockFilter, sortBy]);

  const tableRows = filteredProducts.map((product) => ({
    _id: product._id,
    image:
      product.images?.[0] ||
      product.thumbnail ||
      product.image ||
      "",
    name: product.name,
    stock: product.stock ?? 0,
    price: product.price ?? 0,
    raw: product,
  }));

  return (
    <div className="space-y-6 font-dmsans">
      {/* Hero Header */}
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Products Management
              </h1>

              <p className="mt-1 text-muted-foreground">
                Manage inventory, stock availability and
                pricing across your marketplace.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-3 shadow-sm">
              <Package className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Products
                </p>

                <p className="font-bold">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Products
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {totalProducts}
                </h3>
              </div>

              <div className="rounded-2xl bg-primary/10 p-3">
                <Boxes className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  In Stock
                </p>

                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {inStockCount}
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
                  Out Of Stock
                </p>

                <h3 className="mt-2 text-3xl font-bold text-red-500">
                  {outStockCount}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-500/10 p-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="pl-10"
              />
            </div>

            <Select
              value={stockFilter}
              onValueChange={setStockFilter}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Products
                </SelectItem>

                <SelectItem value="in-stock">
                  In Stock
                </SelectItem>

                <SelectItem value="out-stock">
                  Out Of Stock
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="latest">
                  Latest
                </SelectItem>

                <SelectItem value="name">
                  Name A-Z
                </SelectItem>

                <SelectItem value="price-low">
                  Price Low → High
                </SelectItem>

                <SelectItem value="price-high">
                  Price High → Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-16 w-full rounded-xl"
                  />
                )
              )}
            </div>
          ) : (
            <SimpleTable
              columns={[
                {
                  key: "image",
                  label: "Product",
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarImage
                          src={row.image}
                        />

                        <AvatarFallback>
                          {row.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">
                          {row.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          #{row._id?.slice(-6)}
                        </p>
                      </div>
                    </div>
                  ),
                },

                {
                  key: "stock",
                  label: "Stock Status",
                  render: (row) =>
                    row.stock > 0 ? (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Out Of Stock
                      </Badge>
                    ),
                },

                {
                  key: "price",
                  label: "Price",
                  render: (row) => (
                    <span className="font-semibold text-primary">
                      Rs {row.price}
                    </span>
                  ),
                },

                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/products/${row._id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleToggleStock(
                            row.raw
                          )
                        }
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          setDeleteTarget(row._id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={tableRows}
              emptyText="No products found."
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page {page} of {totalPages}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() =>
                setPage((prev) =>
                  Math.max(1, prev - 1)
                )
              }
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
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