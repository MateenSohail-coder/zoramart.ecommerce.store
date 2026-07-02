"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
  CardFooter,
} from "../ui/card";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { VerifiedIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { verifyOtp } from "@/lib/verify-otp";
import { useSession } from "next-auth/react";
import { Spinner } from "../ui/spinner";
import { redirect } from "next/navigation";

export function OtpVerificationForm({ id }) {
  const [isCorrect, setisCorrect] = React.useState(false);
  const { data: session, update } = useSession();

  const form = useForm({
    defaultValues: { code: "" },
  });

  const [resendTimer, setResendTimer] = React.useState(0);
  const [loading, setloading] = React.useState(false);
  React.useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data) => {
    setloading(true);
    const userid = session.user.id;
    if (!userid) {
      return null;
    }
    try {
      const res = await verifyOtp(userid, data.code);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      const apiResponse = await axios.put(`/api/auth/signup?userId=${userid}`, {
        isVerified: true,
      });
      if (apiResponse.status === 200) {
        setisCorrect(true);
        toast.success("Verification successful!");
        await update({ isVerified: true });
        // Brief delay so the session cookie propagates before navigation
        await new Promise((r) => setTimeout(r, 400));
        window.location.href =
          session?.user.role === "seller" ? "/seller-onboarding" : "/";
      }
    } catch {
      toast.error("somthing wrong");
    } finally {
      setloading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(60);
  };

  const code = form.watch("code");
  const isOtpComplete = code?.length === 6;

  return (
    <Card className="w-full relative max-w-sm">
      <CardHeader className="space-y-1 text-center p-5">
        <CardTitle className="text-2xl flex flex-col items-center justify-center gap-5">
          <Link href="/">
            <div className="relative h-11 w-30">
              <Image
                src="/zMartDark.png"
                alt="zMart"
                fill={true}
                loading="eager"
                className="object-cover  hidden dark:inline"
              />
              <Image
                src="/zMartLight.png"
                alt="zMart"
                fill={true}
                loading="eager"
                className="object-cover inline dark:hidden"
              />
            </div>
          </Link>
          Verify your account
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code we sent to your email.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 px-10">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex items-center justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => form.setValue("code", value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {form.formState.errors.code && (
            <p className="text-sm text-destructive">
              {form.formState.errors.code.message}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full bg-main text-white "
            disabled={!isOtpComplete}
          >
            {loading && <Spinner />}
            {loading ? "Verifiying..." : "Verify"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center rounded-0">
        <Button
          variant="link"
          size="sm"
          onClick={handleResend}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
        </Button>
      </CardFooter>
      {isCorrect && (
        <div className="absolute z-[1000] transition-all flex flex-col items-center justify-center w-full h-full top-0 bg-amber-50">
          <VerifiedIcon size={100} className="text-green-600 transition-all" />
          <p className="font-dmsans transition-all text-2xl font-extrabold text-green-600">
            Verification Sucessfull
          </p>
        </div>
      )}
    </Card>
  );
}
