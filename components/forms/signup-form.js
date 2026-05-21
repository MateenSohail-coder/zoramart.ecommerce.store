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
import { signupSchema } from "@/lib/singupSchema";
import { useState } from "react";
import axios from "axios";
import { Spinner } from "../ui/spinner";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function SignupForm({ className, ...props }) {
  const [role, setRole] = useState("buyer");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    const userInfo = {
      ...data,
      role: role,
      isVerified: false,
      isBlocked: false,
    };
    try {
      const res1 = await axios.post("/api/auth/signup", userInfo);
      const res2 = await axios.post("/api/auth/otpGenerate", {
        userId: res1.data?.newUser?._id,
      });
      await signIn("credentials", {
        id: res1.data?.newUser?._id,
        redirectTo: "/otp-verification",
      });
      reset();
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
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <div className="w-full flex gap-3">
          {/* Buyer box */}
          <FieldLabel
            className={cn(
              "flex-1 flex items-center justify-center py-2 text-center text-sm font-medium rounded-md border border-input cursor-pointer transition-colors",
              role === "buyer"
                ? "bg-primary/10 text-primary border-primary"
                : "bg-background text-muted-foreground hover:bg-muted/50",
              "dark:bg-card dark:hover:bg-muted/50", // dark mode tweaks if needed
            )}
          >
            Guest
            <Input
              type="radio"
              name="role"
              value="buyer"
              checked={role === "buyer"}
              onChange={() => setRole("buyer")}
              className="sr-only"
            />
          </FieldLabel>

          {/* Seller box */}
          <FieldLabel
            className={cn(
              "flex-1 flex items-center justify-center py-2 text-center text-sm font-medium rounded-md border border-input cursor-pointer transition-colors",
              role === "seller"
                ? "bg-primary/10 text-primary border-primary"
                : "bg-background text-muted-foreground hover:bg-muted/50",
              "dark:bg-card dark:hover:bg-muted/50",
            )}
          >
            Seller
            <Input
              type="radio"
              name="role"
              value="seller"
              checked={role === "seller"}
              onChange={() => setRole("seller")}
              className="sr-only"
            />
          </FieldLabel>
        </div>
        {/* Full Name Field */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Ali Raza"
            className="bg-background"
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name ? (
            <p className="text-sm font-medium text-destructive">
              {errors.name.message}
            </p>
          ) : (
            <FieldDescription>Enter your legal name.</FieldDescription>
          )}
        </Field>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="aliraza@example.com"
            className="bg-background"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
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

        {/* Password Field */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="text"
            className="bg-background"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password ? (
            <p className="text-sm font-medium text-destructive">
              {errors.password.message}
            </p>
          ) : (
            <FieldDescription>
              Must be at least 8 characters long, contain 1 uppercase letter,
              and 1 special character.
            </FieldDescription>
          )}
        </Field>

        {/* Confirm Password Field */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            className="bg-background"
            {...register("confirmPassword")}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword ? (
            <p className="text-sm font-medium text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : (
            <FieldDescription>Please confirm your password.</FieldDescription>
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
          {role === "buyer" && (
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
          )}
          <FieldDescription className="px-6 text-center mt-2">
            Already have an account?
            <a
              href="/login"
              className="underline underline-offset-4 p-3 hover:text-primary"
            >
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
