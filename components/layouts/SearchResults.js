"use client";

import React, { useState } from "react";
import { Search, PackageX } from "lucide-react";
import { useGetProductsQuery } from "@/features/product/productApi";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/productCardSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isFetching } = useGetProductsQuery({
    search: query,
    page,
    limit,
    sort: "relevance",
  });

  const products = data?.products || [];
  const hasMore = data?.hasMore ?? false;
  const total = data?.total ?? 0;

  return (
    <section className="w-full px-2 py-8 md:px-4 lg:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-[#ff6f00]" />
          <h1 className="text-2xl font-bold font-sora tracking-tight">
            Search results for &ldquo;{query}&rdquo;
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-dmsans">
          {total} product{total !== 1 ? "s" : ""} found
        </p>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {isLoading && page === 1 ? (
          [...Array(limit)].map((_, i) => <ProductCardSkeleton key={i} />)
        ) : products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <PackageX className="h-10 w-10 opacity-40" />
            <p className="text-sm">No products found for &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <>
            {products.map((product) => (
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
                inStock={product.stock > 0}
                description={product.description}
              />
            ))}
            {isFetching &&
              page > 1 &&
              [...Array(limit)].map((_, i) => (
                <ProductCardSkeleton key={`more-skeleton-${i}`} />
              ))}
          </>
        )}
      </div>

      {hasMore && !isLoading && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Separator className="flex-1 opacity-40" />
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            variant="outline"
            className="rounded-xl border-[#ff6f00]/30 px-6 text-sm font-semibold text-[#ff6f00] hover:bg-[#ff6f00] hover:text-white hover:border-[#ff6f00] transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
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
