"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function TopBar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  return (
    <div className="bg-[#ff6f00] font-dmsans text-white text-xs">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-1 text-xs sm:px-6 lg:px-8 sm:text-sm">
        <div className="md:flex hidden items-center gap-3 opacity-95">
          <span>Free delivery on orders above Rs. 5,000</span>

          <span className="hidden sm:inline">•</span>

          <span className="hidden sm:inline">24/7 Customer Support</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/track-order" className="hover:underline">
            Track Order
          </Link>

          <Link href="/help" className="hover:underline">
            Help
          </Link>
          {status === "authenticated" && user ? null : (
            <>
              {" "}
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="font-medium hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
