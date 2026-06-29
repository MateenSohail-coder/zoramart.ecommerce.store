"use client";

import * as React from "react";

import { Bell, Trash2, Package, CheckCircle2, Clock3 } from "lucide-react";

import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
} from "@/features/notification/notificationApi";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

export default function UserNotificationsPage() {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery({
    role: "user",
  });

  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteNotification({ id: deleteTarget });
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setDeleteTarget(null);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}

      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>

            <p className="text-orange-100">
              Stay updated with your account activity
            </p>
          </div>

          <Bell className="h-12 w-12" />
        </CardContent>
      </Card>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total</p>

            <h2 className="mt-1 text-3xl font-bold">{notifications.length}</h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Unread</p>

            <h2 className="mt-1 text-3xl font-bold text-[#ff6f00]">
              {unreadCount}
            </h2>
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Read</p>

            <h2 className="mt-1 text-3xl font-bold text-green-600">
              {notifications.length - unreadCount}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* Notification Feed */}

      <Card className="rounded-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <Bell className="mb-4 h-16 w-16 text-muted-foreground" />

              <h3 className="text-xl font-semibold">No Notifications</h3>

              <p className="mt-2 text-muted-foreground">
                You're all caught up.
              </p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification._id}>
                <div className="flex items-start justify-between gap-4 p-5 transition-colors hover:bg-muted/40">
                  <div className="flex gap-4">
                    {/* Icon */}

                    <div
                      className={`mt-1 flex h-10 w-10 items-center justify-center rounded-sm ${
                        notification.read ? "bg-muted" : "bg-[#ff6f00]/10"
                      }`}
                    >
                      {notification.read ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Package className="h-5 w-5 text-[#ff6f00]" />
                      )}
                    </div>

                    {/* Content */}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {notification.title || "Notification"}
                        </h3>

                        {!notification.read && (
                          <Badge className="rounded-sm bg-[#ff6f00]">New</Badge>
                        )}
                      </div>

                      {notification.message && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock3 className="h-3 w-3" />

                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : "-"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-sm text-red-500 hover:text-red-600"
                    onClick={() => setDeleteTarget(notification._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {index !== notifications.length - 1 && <Separator />}
              </div>
            ))
          )}
        </CardContent>
      </Card>
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
