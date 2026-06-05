"use client";

import { SignupForm } from "@/components/forms/signup-form";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh  lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex  justify-center items-center w-full">
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
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="sticky border-l-8 border-l-neutral-300 dark:border-l-neutral-700 h-screen overflow-hidden top-0 hidden bg-muted lg:block">
        <img
          src="/Signup-poster.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] "
        />
      </div>
    </div>
  );
}
