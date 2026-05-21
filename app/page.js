"use client";
import { ModeToggle } from "@/components/common/modeToggle";
import SignIn from "@/components/signin";
import { Spinner } from "@/components/ui/spinner";
import { verifyOtp } from "@/lib/verify-otp";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
   const { data: session } = useSession();
   if (session?.user) {
     console.log(session.user);
   }
   async function sub() {
     const res = await verifyOtp("6a0c96fb7ec06ebf8f7ab064", 888162);
     console.log(res);
   }
   
  return (
    <div className="">
      <SignIn />
      <ModeToggle />
      <Spinner />
      <div className="text-8xl font-bold font-sora text-main">
        id:{session?.user.id}
      </div>
      <div className="">email:{session?.user.email}</div>
      <div className="">name:{session?.user.name}</div>
      <div className="">role:{session?.user.role}</div>
      <div className="font-dmSans text-2xl font-extralight ">
        isVerified:{session?.user.isVerified.toString()}
      </div>
      <button
        onClick={() => sub()}
        className="font-sora font-extrabold text-5xl text-orange-500"
      >
        submit{" "}
      </button>
    </div>
  );
}

