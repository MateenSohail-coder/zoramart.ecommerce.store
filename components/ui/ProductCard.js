import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Truck, CheckCircle2 } from "lucide-react";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&auto=format&fit=crop&q=60";

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  discount,
  rating = 4.5,
  reviews = 0,
  image,
  badge,
  freeShipping,
  inStock,
  sold = 0,
  slug,
  href,
}) {
  const productHref =
    href || (slug ? `/product?slug=${slug}` : id ? `/product?id=${id}` : "#");

  const displayImage = image || DEFAULT_IMAGE;

  const discountLabel =
    discount ||
    (originalPrice && price
      ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}%`
      : null);

  return (
    <Link href={productHref}>
      <Card className="group overflow-hidden rounded-xs border border-border/50 bg-white dark:bg-background font-dmsans shadow-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] h-full">
        <div className="relative overflow-hidden">
          <div className="relative aspect-square bg-muted">
            {/* displayImage */}
            <Image
              src="data:image/png;base64,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"
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {badge && (
            <div className="absolute left-2 top-2 rounded-sm bg-[#ff6f00] px-2 py-0.5 text-[10px] font-medium text-white">
              {badge}
            </div>
          )}

          {discountLabel && (
            <div className="absolute right-2 top-2 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
              {discountLabel} OFF
            </div>
          )}
        </div>

        <CardContent className="space-y-1 px-1.5 pb-3">
          <div>
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
              {name}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

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
              {Number(reviews).toLocaleString()}
            </span>
          </div>

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

          {sold > 0 && (
            <div className="text-[11px] text-muted-foreground">
              {sold.toLocaleString()} sold
            </div>
          )}

          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-[#ff6f00]">
              Rs. {Number(price).toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                Rs. {Number(originalPrice).toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
