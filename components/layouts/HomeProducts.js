"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, PackageX } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import { useGetProductsQuery } from "@/features/product/productApi";
import ProductCardSkeleton from "../ui/productCardSkeleton";

export default function HomeProducts() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Keep accumulated items across pages
  const [items, setItems] = useState([]);
  // Track if we've ever successfully loaded (to avoid flash of empty state)
  const hasLoadedOnce = useRef(false);

  const { data, isLoading, isFetching, error } = useGetProductsQuery(
    { page, limit },
    {
      // Keep previous data in cache while fetching next page
      // This prevents the grid from going blank during pagination
    },
  );

  useEffect(() => {
    if (!data?.products) return;

    hasLoadedOnce.current = true;

    if (page === 1) {
      // Fresh load or reset — replace all items
      setItems(data.products);
    } else {
      // Pagination — append only new items
      setItems((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newItems = data.products.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newItems];
      });
    }
  }, [data, page]);

  const hasMore = data?.hasMore ?? false;

  // How many skeleton cards to show when loading more
  const loadingMoreCount = limit;

  return (
    <section className="w-full px-2 py-8 md:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1 w-6 rounded-full bg-[#ff6f00]" />
            <span className="text-xs font-dmsans font-semibold uppercase tracking-widest text-[#ff6f00]">
              Today's Picks
            </span>
          </div>
          <h2 className="text-2xl font-sora font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Featured Products
          </h2>
          <p className="text-sm font-dmsans text-muted-foreground">
            Handpicked deals with the best value for you
          </p>
        </div>

        <Button
          variant="ghost"
          className="group self-start font-dmsans sm:self-auto text-[#ff6f00] hover:text-[#e96400] hover:bg-[#ff6f00]/8 font-semibold text-sm"
        >
          View All
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {/* ── CASE 1: First-ever load — show full skeleton grid ── */}
        {isLoading && page === 1 && items.length === 0 ? (
          [...Array(limit)].map((_, i) => <ProductCardSkeleton key={i} />)
        ) : /* ── CASE 2: Hard error with nothing loaded yet ── */
        error && items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <PackageX className="h-10 w-10 opacity-40" />
            <p className="text-sm font-dmsans">
              Failed to load products. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              className="mt-1 border-[#ff6f00]/30 font-dmsans text-[#ff6f00] hover:bg-[#ff6f00] hover:text-white"
            >
              Retry
            </Button>
          </div>
        ) : /* ── CASE 3: Loaded but empty ── */
        !isLoading && items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <PackageX className="h-10 w-10 opacity-40" />
            <p className="text-sm font-dmsans">No Product Found .</p>
          </div>
        ) : (
          /* ── CASE 4: Normal render — existing items + optional load-more skeletons ── */
          <>
            {items.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                originalPrice={product.downprice}
                image={product.images?.[0]}
                rating={product.rating || 4.5}
                reviews={product.reviews || 0}
                badge="Bestseller"
                sold={product.sold || 0}
                inStock={product.stock > 0}
                description={product.description}
              />
            ))}

            {/* Append skeletons AFTER existing cards only when paginating */}
            {isFetching &&
              page > 1 &&
              [...Array(loadingMoreCount)].map((_, i) => (
                <ProductCardSkeleton key={`more-skeleton-${i}`} />
              ))}
          </>
        )}
      </div>

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Separator className="flex-1 opacity-40" />
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            variant="outline"
            className="rounded-xl font-dmsans border-[#ff6f00]/30 px-6 text-sm font-semibold text-[#ff6f00] hover:bg-[#ff6f00] hover:text-white hover:border-[#ff6f00] transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isFetching ? (
              <span className="flex font-dmsans items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Loading...
              </span>
            ) : (
              "Load More Products"
            )}
          </Button>
          <Separator className="flex-1 opacity-40" />
        </div>
      )}
    </section>
  );
}
