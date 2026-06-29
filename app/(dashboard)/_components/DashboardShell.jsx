"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { useGetOrdersQuery } from "@/features/order/orderApi";

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardShell({ role, children }) {
  const pathname = usePathname();

  const { data } = useGetOrdersQuery({
    page: 1,
    limit: 1,
  });

  const notificationCount = Array.isArray(data?.orders) ? data.orders.length : 0;

  const titleByPath = () => {
    if (!pathname) return "Dashboard";

    const parts = pathname.split("/").filter(Boolean);

    const last = parts[parts.length - 1] || "overview";

    return last.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar role={role} />

      <SidebarInset>
        {/* Mobile + Desktop Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex-1">
            <DashboardHeader
              role={role}
              title={titleByPath()}
              notificationCount={notificationCount}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
