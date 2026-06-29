"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, MapPin, Tag } from "lucide-react";

import { useGetCartQuery } from "@/features/cart/cartApi";
import { useCheckoutMutation } from "@/features/order/orderApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    skip: status !== "authenticated",
  });
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const [orderComplete, setOrderComplete] = React.useState(null);

  const [form, setForm] = React.useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    paymentMethod: "COD",
    couponCode: "",
  });

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/Checkout");
    }
  }, [status, router]);

  React.useEffect(() => {
    if (!isLoading && cart && (!cart.items || cart.items.length === 0) && !orderComplete) {
      router.push("/cart");
    }
  }, [cart, isLoading, orderComplete, router]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await checkout({
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        couponCode: form.couponCode || undefined,
      }).unwrap();

      setOrderComplete(result.order);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Checkout failed");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Order #{String(orderComplete._id).slice(-8).toUpperCase()} has been placed.
        </p>
        <p className="mt-1 text-lg font-semibold text-[#ff6f00]">
          Total: Rs. {Number(orderComplete.totalAmount).toLocaleString()}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => router.push("/user/orders")} className="bg-[#ff6f00] hover:bg-[#e66300]">
            View Orders
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#ff6f00]" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={form.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={form.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#ff6f00]" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) => handleChange("paymentMethod", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                  <SelectItem value="Card">Credit / Debit Card</SelectItem>
                  <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
                  <SelectItem value="JazzCash">JazzCash</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#ff6f00]" />
                Coupon Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Try SAVE10 or FLAT50"
                value={form.couponCode}
                onChange={(e) => handleChange("couponCode", e.target.value)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                SAVE10 = 10% off · FLAT50 = Rs. 50 off
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit rounded-xl">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 pr-2">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {Number(cart?.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {cart?.shipping === 0
                    ? "Free"
                    : `Rs. ${Number(cart?.shipping || 0).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs. {Number(cart?.tax || 0).toLocaleString()}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#ff6f00]">
                Rs. {Number(cart?.total || 0).toLocaleString()}
              </span>
            </div>

            <Button
              type="submit"
              disabled={isCheckingOut || items.length === 0}
              className="w-full rounded-xl bg-[#ff6f00] hover:bg-[#e66300]"
            >
              {isCheckingOut ? "Processing..." : "Place Order"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
