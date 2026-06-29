"use client";

import * as React from "react";
import {
  Search,
  User,
  Trash2,
  Ban,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "@/features/users/userApi";
import SimpleTable from "../../_components/SimpleTable";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

export default function AdminCustomersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [search, setSearch] = React.useState("");

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [banning, setBanning] = React.useState(null);

  const customers = users
    .filter((u) => u.role === "buyer")
    .filter((user) => {
      const query = search.toLowerCase();
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget).unwrap();
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleBan = async (id, current) => {
    setBanning(id);
    try {
      await updateUser({ id, isBlocked: !current }).unwrap();
      toast.success(current ? "User unbanned" : "User banned");
    } catch {
      toast.error("Failed to update user");
    } finally {
      setBanning(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Registered platform users</p>
      </div>

      <Badge className="px-3 py-1">
        <User className="mr-1 h-4 w-4" />
        {customers.length} Customers
      </Badge>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customer..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <SimpleTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "role",
            label: "Role",
            render: (row) => (
              <Badge variant="outline">{row.role || "buyer"}</Badge>
            ),
          },
          {
            key: "verified",
            label: "Verified",
            render: (row) => (
              <Badge className={row.isVerified ? "bg-green-100 text-green-700" : ""}>
                {row.isVerified ? "Yes" : "No"}
              </Badge>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row) =>
              row.isBlocked ? (
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
                  variant={row.isBlocked ? "outline" : "destructive"}
                  onClick={() => toggleBan(row._id, row.isBlocked)}
                  disabled={banning === row._id}
                >
                  {banning === row._id ? (
                    "..."
                  ) : row.isBlocked ? (
                    <>
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Unban
                    </>
                  ) : (
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
        rows={customers}
        emptyText="No customers found."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete User"
        description="This will permanently delete this user account. This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
