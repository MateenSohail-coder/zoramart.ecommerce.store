"use client";
import { ModeToggle } from "@/components/common/modeToggle";
import SignIn from "@/components/signin";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <SignIn />
      <ModeToggle />
    </div>
  );
}
