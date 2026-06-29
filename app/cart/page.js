"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "@/features/cart/cartApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    skip: status !== "authenticated",
  });
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/cart");
    }
  }, [status, router]);

  const items = cart?.items || [];

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantity = async (productId, quantity) => {
    try {
      await updateCartItem({ productId, quantity }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-8">
      <Card className="rounded-xl border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-orange-100">
              {session?.user?.name ? `Hi ${session.user.name}, ` : ""}
              review your selected products
            </p>
          </div>
          <ShoppingCart className="h-12 w-12" />
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-muted-foreground">
              Add products and they will appear here.
            </p>
            <Link href="/">
              <Button className="mt-5 rounded-xl bg-[#ff6f00] hover:bg-[#e66300]">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <Card key={item.productId} className="rounded-xl">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&auto=format&fit=crop"
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        href={
                          item.slug
                            ? `/product?slug=${item.slug}`
                            : `/product?id=${item.productId}`
                        }
                        className="font-semibold hover:text-[#ff6f00]"
                      >
                        {item.name}
                      </Link>
                      <Badge variant="secondary" className="mt-2 rounded-sm">
                        {item.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                      <div className="mt-3 text-lg font-bold text-[#ff6f00]">
                        Rs. {Number(item.price).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center rounded-lg border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-none"
                          onClick={() =>
                            handleQuantity(
                              item.productId,
                              Math.max(1, item.quantity - 1),
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-10 px-4 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-none"
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            handleQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-sm text-red-600"
                        onClick={() => handleRemove(item.productId)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit rounded-xl">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Items ({items.length})</span>
                  <span>
                    Rs. {Number(cart?.subtotal || 0).toLocaleString()}
                  </span>
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
                  <span>Tax (5%)</span>
                  <span>Rs. {Number(cart?.tax || 0).toLocaleString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#ff6f00]">
                  Rs.{" "}
                  {Number(
                    cart?.total || cart?.totalAmount || 0,
                  ).toLocaleString()}
                </span>
              </div>

              <Link href="/Checkout">
                <Button className="mt-5 w-full rounded-xl bg-[#ff6f00] hover:bg-[#e66300]">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="mt-3 w-full rounded-xl">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
