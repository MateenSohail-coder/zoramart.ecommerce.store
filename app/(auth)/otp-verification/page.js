"use client";
import { OtpVerificationForm } from "@/components/forms/Otp-form";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function otpVerification() {
  const { data: session, status } = useSession();
  const [pageloader, setpageloader] = useState(false);
  useEffect(() => {
    if (session?.user.isVerified === true) {
      window.location.href = "/";
    } else {
      setpageloader(false);
    }
  }, [session, status]);
  useEffect(() => {
    setpageloader(true);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div className="md:m-0 m-5">
        <OtpVerificationForm />
      </div>
      {pageloader && (
        <div className="flex items-center justify-center absolute w-full h-full top-0 bottom-0">
          <div className="flex flex-col items-center justify-center gap-5 bg-neutral-200 p-10 rounded-sm">
            <Spinner className="size-10 text-neutral-600" />
            <p className="font-dmsans text-neutral-600">
              Verifying User Status
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
