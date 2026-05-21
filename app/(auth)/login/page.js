"use client";

import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh  justify-around lg:grid-cols-2">
      <div className="sticky border-r-8 border-r-neutral-700 h-screen overflow-hidden top-0 hidden bg-muted lg:block">
        <img
          src="/poster4.jfif"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] "
        />
      </div>
      <div className="flex flex-col justify-center gap-10 w-screen md:w-auto p-6 md:p-8">
        <div className="flex justify-center items-center w-full">
          <Link href="/">
            <div className="relative h-11 w-30">
              <Image
                src="/zMartDark.png"
                alt="zMart"
                fill={true}
                loading="lazy"
                className="bg-cover dark:visible"
              />
              <Image
                src="/zMartLight.png"
                alt="zMart"
                fill={true}
                loading="lazy"
                className="bg-cover visible dark:hidden"
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
