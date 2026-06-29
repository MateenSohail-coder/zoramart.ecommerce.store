"use client";

import * as React from "react";

import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from "@/features/notification/notificationApi";

import SimpleTable from "../../_components/SimpleTable";
import NotificationsTableSkeleton from "../../_components/notifications-table-skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

import {
  Bell,
  BellRing,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function SellerNotificationsPage() {
  const { data = [], isLoading } = useGetNotificationsQuery({
    role: "seller",
    read: undefined,
  });

  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const unreadCount = data.filter((n) => !n.read).length;
  const readCount = data.filter((n) => n.read).length;

  const rows = data.map((n) => ({
    _id: n._id,
    title: n.title || "Notification",
    message: n.message || "-",
    read: n.read,
    createdAt: n.createdAt
      ? new Date(n.createdAt).toLocaleString()
      : "-",
  }));

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteNotification({ id: deleteTarget }).unwrap();
      toast.success("Notification deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notification");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return <NotificationsTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sora font-medium ">
          Notifications
        </h1>

        <p className="text-muted-foreground font-dmsans">
          Stay updated with order activity, system alerts, and
          marketplace updates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Notifications
              </p>
              <p className="text-3xl font-bold">{data.length}</p>
            </div>

            <Bell className="h-10 w-10 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Unread
              </p>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </div>

            <BellRing className="h-10 w-10 text-amber-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Read
              </p>
              <p className="text-3xl font-bold">{readCount}</p>
            </div>

            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            View and manage all notifications received by your
            seller account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SimpleTable
            columns={[
              {
                key: "title",
                label: "Title",
              },
              {
                key: "createdAt",
                label: "Date",
              },
              {
                key: "read",
                label: "Status",
                render: (row) => (
                  <Badge
                    variant={
                      row.read ? "secondary" : "default"
                    }
                  >
                    {row.read ? "Read" : "Unread"}
                  </Badge>
                ),
              },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setDeleteTarget(row._id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
            rows={rows}
            emptyText="No notifications found."
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {rows.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              No Notifications
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Notifications related to orders, products, and
              account activity will appear here.
            </p>
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Notification"
        description="Are you sure you want to delete this notification?"
        onConfirm={handleDelete}
      />
    </div>
  );
}