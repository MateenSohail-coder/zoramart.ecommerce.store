import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Truck, CheckCircle2 } from "lucide-react";

export default function ProductCard({
  name,
  description,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  image,
  badge,
  freeShipping,
  inStock,
  sold,
}) {
  return (
    <Card className="group overflow-hidden rounded-xs border border-border/50 bg-white dark:bg-background font-dmsans shadow-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="relative aspect-square bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3RzfGVufDB8fDB8fHww"
            alt={name}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute left-2 top-2 rounded-sm bg-[#ff6f00] px-2 py-0.5 text-[10px] font-medium text-white">
            {badge}
          </div>
        )}

        {/* Discount */}
        {discount && (
          <div className="absolute right-2 top-2 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
            {discount} OFF
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="space-y-1 px-1.5">
        {/* Title */}
        <div className="">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            {name}
          </h3>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-3.5 w-3.5 ${
                    index < Math.round(rating)
                      ? "fill-[#ff6f00] text-[#ff6f00]"
                      : "fill-muted text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-medium text-foreground">
              {rating}
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground">
            {reviews.toLocaleString()}
          </span>
        </div>

        {/* Shipping + Stock */}
        <div className="flex flex-wrap items-center gap-1 text-[7px] md:text-[10px]">
          {freeShipping && (
            <div className="flex items-center gap-1 rounded-sm bg-[#ff6f00]/10 px-2 py-1 text-[#ff6f00]">
              <Truck className="md:h-3 h-1 w-1 md:w-3" />
              Free Shipping
            </div>
          )}

          {inStock && (
            <div className="flex items-center gap-1 rounded-sm bg-green-500/10 px-2 py-1 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              In Stock
            </div>
          )}
        </div>

        {/* Sold */}
        <div className="text-[11px] text-muted-foreground">
          {sold.toLocaleString()} sold
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-[#ff6f00]">{price}</span>

          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
