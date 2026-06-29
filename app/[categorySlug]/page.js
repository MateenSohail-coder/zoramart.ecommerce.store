"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import { useGetCategoriesQuery, useGetCategoryBySlugQuery } from "@/features/categories/categoryApi";
import { useGetProductsQuery } from "@/features/product/productApi";

import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/productCardSkeleton";
import {
  LayoutGrid,
  ArrowUpDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="container py-8 px-4">Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}

function CategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = params.categorySlug;
  const categoryId = searchParams.get("id");
  const parentId = searchParams.get("parentId");

  const { data: resolvedCategory } = useGetCategoryBySlugQuery(categorySlug, {
    skip: !!categoryId,
  });

  const effectiveCategoryId = categoryId || resolvedCategory?._id;

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("low");
  const [allProducts, setAllProducts] = useState([]);

  const limit = 5;

  const sidebarCategoryId = parentId || effectiveCategoryId;
  const { data: categories = [], isLoading: categoryLoading } =
    useGetCategoriesQuery(sidebarCategoryId);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    categoryId: effectiveCategoryId,
    page,
    limit,
  });

  const products = data?.products || [];

  const hasMore = data?.hasMore ?? false;
  useEffect(() => {
    setAllProducts([]);
    setPage(1);
  }, [effectiveCategoryId]);

  useEffect(() => {
    if (!products.length) return;

    setAllProducts((prev) => {
      const ids = new Set(prev.map((p) => p._id));

      const freshProducts = products.filter((p) => !ids.has(p._id));

      return [...prev, ...freshProducts];
    });
  }, [products]);

  const sortedProducts = useMemo(() => {
    const copy = [...allProducts];

    if (sort === "low") {
      return copy.sort((a, b) => a.price - b.price);
    }

    return copy.sort((a, b) => b.price - a.price);
  }, [allProducts, sort]);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Creates a smooth scrolling animation
    });
  };
  return (
    <section className="container py-8 px-4">
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sora capitalize">
          {decodeURIComponent(categorySlug)}
        </h1>

        <p className="text-muted-foreground font-dmsans mt-2">
          Discover products in this category
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar */}

        <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
          {/* Categories */}

          <Card className="rounded-sm border shadow-sm">
            <CardHeader className="border-b bg-[#ff6f00]/5 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <LayoutGrid size={18} className="text-[#ff6f00]" />
                Sub Categories
              </CardTitle>
            </CardHeader>

            <CardContent className="p-3">
              <ScrollArea className="h-72">
                <div className="space-y-1">
                  {categoryLoading ? (
                    <div className="text-sm text-muted-foreground">
                      Loading categories...
                    </div>
                  ) : (
                    categories?.map((item) => (
                      <Button
                        key={item._id}
                        variant="ghost"
                        className="
                  w-full
                  justify-between
                  rounded-sm
                  h-10
                  px-3
                  font-normal
                  text-sm
                  hover:bg-[#ff6f00]/10
                  hover:text-[#ff6f00]
                  transition-colors
                "
                        onClick={() =>
                          router.push(
                            `/${item.slug}?id=${item._id}&parentId=${parentId || effectiveCategoryId}`,
                          )
                        }
                      >
                        <span>{item.name}</span>

                        <ChevronRight size={16} className="opacity-60" />
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Sort Products */}

          <Card className="rounded-sm border shadow-sm">
            <CardHeader className="border-b bg-[#ff6f00]/5 py-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <ArrowUpDown size={18} className="text-[#ff6f00]" />
                Sort Products
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              <RadioGroup
                value={sort}
                onValueChange={setSort}
                className="space-y-3"
              >
                <Label
                  htmlFor="low"
                  className="
            flex
            items-center
            gap-3
            rounded-sm
            border
            p-3
            cursor-pointer
            hover:border-[#ff6f00]
            hover:bg-[#ff6f00]/5
            transition-all
          "
                >
                  <RadioGroupItem value="low" id="low" />

                  <TrendingDown
                    onClick={scrollToTop}
                    size={16}
                    className="text-[#ff6f00]"
                  />

                  <span className="text-sm">Price: Low → High</span>
                </Label>

                <Label
                  htmlFor="high"
                  className="
            flex
            items-center
            gap-3
            rounded-sm
            border
            p-3
            cursor-pointer
            hover:border-[#ff6f00]
            hover:bg-[#ff6f00]/5
            transition-all
          "
                >
                  <RadioGroupItem value="high" id="high" />

                  <TrendingUp size={16} className="text-[#ff6f00]" />

                  <span className="text-sm">Price: High → Low</span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </aside>

        {/* Products */}

        <div>
          {/* Toolbar */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-sora font-semibold">Products</h2>

              <p className="text-sm text-muted-foreground font-dmsans">
                {sortedProducts.length} products found
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Products Grid */}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading && page === 1 ? (
              [...Array(limit)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              <>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.downprice}
                    image={product.images?.[0]}
                    rating={5}
                    reviews={5}
                    sold={20}
                    inStock={product.stock > 0}
                    description={product.description}
                  />
                ))}

                {isFetching &&
                  page > 1 &&
                  [...Array(limit)].map((_, i) => (
                    <ProductCardSkeleton key={`loading-${i}`} />
                  ))}
              </>
            )}
          </div>

          {/* Empty State */}

          {!isLoading && sortedProducts.length === 0 && (
            <Card className="mt-8 rounded-2xl">
              <CardContent className="py-12 text-center">
                <h3 className="font-semibold text-lg">No Products Found</h3>

                <p className="text-muted-foreground mt-2">
                  There are currently no products available in this category.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Load More */}

          {hasMore && sortedProducts.length > 0 && (
            <div className="flex justify-center mt-10">
              <Button
                size="lg"
                disabled={isFetching}
                className="
                    min-w-[220px]
                    rounded-xl
                  "
                onClick={() => setPage((prev) => prev + 1)}
              >
                {isFetching ? "Loading Products..." : "Load More Products"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}