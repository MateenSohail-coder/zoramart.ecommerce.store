"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
  Bell,
  BarChart3,
  Star,
  Undo2,
  BadgePercent,
  Truck,
  Users,
  Boxes,
  Store,
  LogOut,
  FolderTree,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { User } from "lucide-react";
import Image from "next/image";

export default function DashboardSidebar({ role = "seller", children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const navigation = {
    seller: [
      {
        title: "Dashboard",
        items: [
          {
            title: "Overview",
            url: "/seller/overview",
            icon: LayoutDashboard,
          },
          {
            title: "Analytics",
            url: "/seller/analytics",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "Commerce",
        items: [
          {
            title: "Products",
            url: "/seller/products",
            icon: Package,
          },
          {
            title: "Inventory",
            url: "/seller/inventory",
            icon: Boxes,
          },
          {
            title: "Orders",
            url: "/seller/orders",
            icon: Truck,
          },
          {
            title: "Returns",
            url: "/seller/returns",
            icon: Undo2,
          },
        ],
      },
      {
        title: "Finance",
        items: [
          {
            title: "Earnings",
            url: "/seller/earnings",
            icon: Wallet,
          },
          {
            title: "Coupons",
            url: "/seller/coupons",
            icon: BadgePercent,
          },
        ],
      },
      {
        title: "Account",
        items: [
          {
            title: "Reviews",
            url: "/seller/reviews",
            icon: Star,
          },
          {
            title: "Notifications",
            url: "/seller/notifications",
            icon: Bell,
            badge: "New",
          },
          {
            title: "Settings",
            url: "/seller/shop-settings",
            icon: Settings,
          },
        ],
      },
    ],

    admin: [
      {
        title: "Management",
        items: [
          {
            title: "Overview",
            url: "/admin/overview",
            icon: LayoutDashboard,
          },
          {
            title: "Users",
            url: "/admin/user",
            icon: Users,
          },
          {
            title: "Sellers",
            url: "/admin/sellers",
            icon: Users,
          },
        ],
      },
      {
        title: "Commerce",
        items: [
          {
            title: "Products",
            url: "/admin/products",
            icon: Package,
          },
          {
            title: "Categories",
            url: "/admin/categories",
            icon: FolderTree,
          },
          {
            title: "Orders",
            url: "/admin/orders",
            icon: Truck,
          },
          {
            title: "Payments",
            url: "/admin/payments",
            icon: Wallet,
          },
        ],
      },
      {
        title: "Insights",
        items: [
          {
            title: "Analytics",
            url: "/admin/analytics",
            icon: BarChart3,
          },
          {
            title: "Reviews",
            url: "/admin/reviews",
            icon: Star,
          },
        ],
      },
      {
        title: "System",
        items: [
          {
            title: "Settings",
            url: "/admin/settings",
            icon: Settings,
          },
        ],
      },
    ],

    user: [
      {
        title: "Account",
        items: [
          {
            title: "Overview",
            url: "/user/overview",
            icon: LayoutDashboard,
          },
          {
            title: "Orders",
            url: "/user/orders",
            icon: Truck,
          },
          {
            title: "Cart",
            url: "/user/cart",
            icon: ShoppingCart,
          },
          {
            title: "Wishlist",
            url: "/user/wishlist",
            icon: Star,
          },
        ],
      },
      {
        title: "Payments",
        items: [
          {
            title: "Payments",
            url: "/user/payments",
            icon: Wallet,
          },
        ],
      },
      {
        title: "Support",
        items: [
          {
            title: "Notifications",
            url: "/user/notifications",
            icon: Bell,
          },
          {
            title: "Profile",
            url: "/user/profile",
            icon: Settings,
          },
        ],
      },
    ],
  };

  const sections = navigation[role];

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r">
      {/* Header */}
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/"
                className="order-1 flex shrink-0 items-center gap-3"
              >
                <div className="relative h-11 w-32 sm:w-36">
                  <Image
                    src="/zMartDark.png"
                    alt="zMart"
                    fill
                    priority
                    className="hidden object-contain dark:inline"
                  />

                  <Image
                    src="/zMartLight.png"
                    alt="zMart"
                    fill
                    priority
                    className="object-contain dark:hidden"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="font-dmsans">
        {sections.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.url ||
                    pathname.startsWith(`${item.url}/`);

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={
                          active
                            ? "!bg-[#ff6f00] rounded-xs !text-white hover:!bg-[#ff6f00] hover:!text-white"
                            : "rounded-xs"
                        }
                      >
                        <Link href={item.url} className="group">
                          <Icon className="transition-transform group-hover:scale-110" />
                          <span>{item.title}</span>

                          {"badge" in item && item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto group-data-[collapsible=icon]:hidden"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t font-dmsans">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-1 rounded-md hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback className="bg-[#ff6f00] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-[#2d3235] dark:text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-black/50 dark:text-white/45 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="right"
            className="w-64 rounded-sm border z-[1200] border-black/10 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#12181e]/95"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-[#ff6f00] text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  {" "}
                  {/* Added overflow-hidden */}
                  <p className="text-sm font-semibold text-[#2d3235] dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-black/50 dark:text-white/45 truncate">
                    {" "}
                    {/* Added truncate */}
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

            <DropdownMenuItem
              className="cursor-pointer rounded-sm px-3 py-2.5 focus:bg-[#ff6f00]/10 focus:text-[#ff6f00]"
              asChild
            >
              <Link href={`/${role}/settings`}>
                <Settings className="mr-3 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

            <DropdownMenuItem
              className="cursor-pointer rounded-sm px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
