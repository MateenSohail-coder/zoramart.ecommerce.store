"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();
  const parts = (pathname || "")
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/[-_]/g, " "));

  const crumbs = parts.slice(0, 4);

  return (
    <nav
      className="flex items-center gap-2 text-xs text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <Link href="/">Home</Link>
      {crumbs.map((c, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="max-w-[10rem] truncate">{c}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}
