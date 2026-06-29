"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ModeToggle } from "@/components/common/modeToggle";

export default function DashboardHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const role = segments[0];

  const currentPage =
    segments[segments.length - 1]
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex font-dmsans h-16 bg-transparent shrink-0 items-center gap-2   px-4">
      <SidebarTrigger className="-ml-1" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={`/${role}/overview`}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="hidden md:block" />

          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
