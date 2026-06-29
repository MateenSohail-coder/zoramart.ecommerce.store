"use client";

import * as React from "react";
import {
  Store,
  Search,
  Trash2,
  Users,
  Ban,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  useGetSellerInfosQuery,
  useDeleteSellerInfoMutation,
} from "@/features/sellerInfo/sellerInfoApi";
import { useUpdateUserMutation } from "@/features/users/userApi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import SimpleTable from "../../_components/SimpleTable";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

export default function AdminSellersPage() {
  const { data, isLoading } = useGetSellerInfosQuery();
  const [deleteSellerInfo] = useDeleteSellerInfoMutation();
  const [updateUser] = useUpdateUserMutation();

  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [banning, setBanning] = React.useState(null);

  const sellers = Array.isArray(data) ? data : [];

  const filteredRows = sellers
    .filter((seller) => {
      const query = search.toLowerCase();
      const shop = seller.storeName || seller.shopName || "";
      const phone = seller.phone || "";
      const city = seller.businessAddress?.city || "";

      return (
        shop.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query)
      );
    })
    .map((s) => ({
      _id: s._id,
      sellerId: s.user?._id || s.user || "-",
      shopName: s.storeName || s.shopName || "-",
      phone: s.phone || "-",
      location: s.businessAddress?.city || s.businessAddress?.country || "-",
      isBanned: s.user?.isBlocked ?? false,
    }));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSellerInfo(deleteTarget).unwrap();
      toast.success("Seller info deleted");
    } catch {
      toast.error("Failed to delete seller");
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleBan = async (sellerId, current) => {
    if (!sellerId || sellerId === "-") return;
    setBanning(sellerId);
    try {
      await updateUser({ id: sellerId, isBlocked: !current }).unwrap();
      toast.success(current ? "Seller unbanned" : "Seller banned");
    } catch {
      toast.error("Failed to update seller");
    } finally {
      setBanning(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-52" />
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sellers</h1>
          <p className="text-sm text-muted-foreground">Manage marketplace sellers</p>
        </div>
        <Badge className="h-8 px-3">
          <Users className="mr-1 h-4 w-4" />
          {filteredRows.length} Sellers
        </Badge>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-xl bg-primary/10 p-3">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{sellers.length}</h3>
            <p className="text-sm text-muted-foreground">Registered Sellers</p>
          </div>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search seller..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SimpleTable
        columns={[
          { key: "shopName", label: "Shop" },
          { key: "sellerId", label: "Seller" },
          { key: "phone", label: "Phone" },
          { key: "location", label: "Location" },
          {
            key: "status",
            label: "Status",
            render: (row) =>
              row.isBanned ? (
                <Badge className="bg-red-100 text-red-700">
                  <ShieldAlert className="mr-1 h-3 w-3" />
                  Banned
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={row.isBanned ? "outline" : "destructive"}
                  onClick={() => toggleBan(row.sellerId, row.isBanned)}
                  disabled={banning === row.sellerId || row.sellerId === "-"}
                >
                  {banning === row.sellerId
                    ? "..."
                    : row.isBanned
                      ? (
                        <>
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Unban
                        </>
                      )
                      : (
                        <>
                          <Ban className="mr-1 h-4 w-4" />
                          Ban
                        </>
                      )}
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => setDeleteTarget(row._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        rows={filteredRows}
        emptyText="No sellers found."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Seller"
        description="This will permanently delete this seller's information. The user account will remain."
        onConfirm={handleDelete}
      />
    </div>
  );
}
