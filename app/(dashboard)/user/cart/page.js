"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
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

export default function UserCartPage() {
  const { data: session } = useSession();
  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    skip: !session?.user,
  });
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

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

  return (
    <div className="space-y-6">
      <Card className="rounded-sm border-0 bg-[#ff6f00] text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-orange-100">Review your selected products</p>
          </div>
          <ShoppingCart className="h-12 w-12" />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading cart...</div>
      ) : items.length === 0 ? (
        <Card className="rounded-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="mt-2 text-muted-foreground">
              Add products and they will appear here.
            </p>
            <Link href="/">
              <Button className="mt-5 rounded-sm bg-[#ff6f00] hover:bg-[#e66300]">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <Card key={item.productId} className="rounded-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-sm border bg-muted">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&auto=format&fit=crop"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="mt-2 rounded-sm">
                        {item.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                      <div className="mt-3 text-lg font-bold text-[#ff6f00]">
                        Rs. {Number(item.price).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center rounded-sm border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-none"
                          onClick={() =>
                            handleQuantity(item.productId, Math.max(1, item.quantity - 1))
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-none"
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

          <Card className="h-fit rounded-sm">
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {Number(cart?.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cart?.shipping === 0 ? "Free" : `Rs. ${cart?.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Rs. {Number(cart?.tax || 0).toLocaleString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#ff6f00]">
                  Rs. {Number(cart?.total || 0).toLocaleString()}
                </span>
              </div>

              <Link href="/Checkout">
                <Button className="mt-5 w-full rounded-sm bg-[#ff6f00] hover:bg-[#e66300]">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
