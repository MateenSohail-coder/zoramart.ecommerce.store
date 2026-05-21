"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Spinner } from "../ui/spinner";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function LoginForm({ className, ...props }) {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const userInfo = await axios.post("/api/auth/login", {
        email: data.email,
      });
      await axios.post("/api/auth/otpGenerate", {
        userId: userInfo.data._id,
      });
      await signIn("credentials", {
        id: userInfo.data._id,
        redirectTo: "/otp-verification",
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col font-sora  items-center gap-1 text-center">
          <h1 className="text-3xl font-bold">Login Here !</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="aliraza@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            className="bg-background"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm font-medium text-destructive">
              {errors.email.message}
            </p>
          ) : (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          )}
        </Field>

        {/* Submit Button */}
        <Field>
          <Button
            type="submit"
            className="bg-main text-white"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* GitHub OAuth Button */}

        <Field>
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.91 8.91 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625" />
            </svg>
            Sign up with Google
          </Button>
          <FieldDescription className="px-6 text-center  mt-2">
            Don't have an account?
            <a
              href="/signup"
              className="underline underline-offset-4 p-3 hover:text-primary"
            >
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
