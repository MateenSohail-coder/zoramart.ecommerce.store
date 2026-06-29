"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ShoppingCart,
  User,
  Settings,
  Package,
  Heart,
  LogOut,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Laptop,
  Shirt,
  Smartphone,
  Watch,
  Home,
  Baby,
  Dumbbell,
  Sparkles,
  Tag,
  LayoutDashboard,
} from "lucide-react";

import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import { useGetCartQuery } from "@/features/cart/cartApi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [catOpen, setCatOpen] = React.useState(false);
  const {
    data: categories,
    isLoading: categoriesLoader,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const safeCategories = Array.isArray(categories) ? categories : [];

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: status !== "authenticated",
  });
  const cartCount = cartData?.items?.length || 0;

  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const dashboardUrl =
    user?.role === "admin"
      ? "/admin/overview"
      : user?.role === "seller"
        ? "/seller/overview"
        : user?.role === "buyer"
          ? "/user/overview"
          : null;

  return (
    <nav className="border-b z-[1000]  sticky top-0 border-black/5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1419] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
      <div className="mx-auto flex min-h-10 max-w-screen-2xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-4 sm:px-6 md:flex-nowrap md:py-2 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="order-1 flex shrink-0 items-center gap-3">
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

        {/* SEARCH */}
        <div className="order-3 flex w-full flex-1 items-center justify-center md:order-2 md:w-auto">
          <SearchBar />
        </div>

        {/* ACTIONS */}
        <div className="order-2 ml-auto flex shrink-0 items-center gap-3 md:order-3 md:ml-0">
          {/* CART */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative inline-flex h-11 w-11 rounded-full border border-black/10 bg-white hover:bg-[#ff6f00]/10 hover:text-[#ff6f00] dark:border-white/10 dark:bg-white/5 dark:hover:bg-[#ff6f00]/15"
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6f00] px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* THEME */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-11 w-11 rounded-full border border-black/10 bg-white hover:bg-[#ff6f00]/10 hover:text-[#ff6f00] dark:border-white/10 dark:bg-white/5 dark:hover:bg-[#ff6f00]/15"
          >
            <Sun className="h-5 w-5 dark:hidden" />

            <Moon className="hidden h-5 w-5 dark:inline-block" />
          </Button>

          {/* USER MENU — only show when authenticated */}
          {status === "authenticated" && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent transition-all hover:ring-[#ff6f00]/20">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="bg-[#ff6f00] font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 rounded-sm border z-[1200] border-black/10 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#12181e]/95"
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="bg-[#ff6f00] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-[#2d3235] dark:text-white">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/45">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />

                {dashboardUrl && (
                  <DropdownMenuItem
                    className="cursor-pointer rounded-sm px-3 py-2.5 focus:bg-[#ff6f00]/10 focus:text-[#ff6f00]"
                    asChild
                  >
                    <Link href={dashboardUrl}>
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  className="cursor-pointer rounded-sm px-3 py-2.5 focus:bg-[#ff6f00]/10 focus:text-[#ff6f00]"
                  asChild
                >
                  <Link href="/user/orders">
                    <Package className="mr-3 h-4 w-4" />
                    My Orders
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
          ) : status === "loading" ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : (
            <Button
              variant="ghost"
              asChild
              className="h-11 rounded-full font-dmsans border border-black/10 bg-white hover:bg-[#ff6f00]/10 hover:text-[#ff6f00] dark:border-white/10 dark:bg-white/5 dark:hover:bg-[#ff6f00]/15"
            >
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="border-t border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1015]/0">
        <div className="mx-auto font-dmsans flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-1 sm:px-6 lg:px-8">
          {/* CATEGORIES */}
          <DropdownMenu open={catOpen} onOpenChange={setCatOpen} modal={false}>
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 gap-2  hover:bg-transparent rounded-xs border-0 active:border-0 bg-transparent "
                >
                  <Menu className="h-4 w-4" />
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {categoriesLoader
                    ? // Renders 3 skeleton lines to represent loading categories
                      [...Array(3)].map((_, i) => (
                        <DropdownMenuItem key={i} className="px-2 py-1.5">
                          <Skeleton className="h-6 w-full rounded-sm" />
                        </DropdownMenuItem>
                      ))
                    : safeCategories.map((cat) => (
                        <DropdownMenuItem
                          key={cat.name}
                          className="cursor-pointer"
                        >
                          <Link
                            href={`/${cat.slug}?id=${cat._id}&main=true&parentId=${cat._id}`}
                          >
                            {cat.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>

          {/* TAGLINE */}
          <div className="hidden items-center gap-2 text-xs text-black/60 dark:text-white/50 lg:flex">
            <Tag className="h-3 w-3" />

            <span>Big savings on gadgets, fashion, and home essentials</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
