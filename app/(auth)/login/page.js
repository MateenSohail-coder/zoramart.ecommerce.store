"use client";

import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh  justify-around lg:grid-cols-2">
      <div className="sticky border-r-8 border-r-neutral-700 h-screen overflow-hidden top-0 hidden bg-muted lg:block">
        <img
          src="/login-poster.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] "
        />
      </div>
      <div className="flex flex-col justify-center gap-10 w-screen md:w-auto p-6 md:p-8">
        <div className="flex justify-center items-center w-full">
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
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
