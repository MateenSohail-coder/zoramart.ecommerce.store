"use client";

import React, { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageSquarePlus,
  ThumbsUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useGetProductQuery,
  useGetProductsQuery,
} from "@/features/product/productApi";
import {
  useGetReviewsQuery,
  useAddReviewMutation,
} from "@/features/reviews/reviewsApi";
import { useAddToCartMutation } from "@/features/cart/cartApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ImageZoom from "@/components/ui/ZoomImage";
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/ui/rating-stars";

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-8">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductQuery({ id, slug }, { skip: !id && !slug });

  const categoryId = product?.category?._id || product?.category || null;

  const { data: relatedData } = useGetProductsQuery(
    { categoryId, page: 1, limit: 4 },
    { skip: !categoryId },
  );

  const { data: reviews = [] } = useGetReviewsQuery(
    { productId: product?._id },
    { skip: !product?._id },
  );

  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [addReview] = useAddReviewMutation();

  const [quantity, setQuantity] = useState(1);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [selectedImage, setSelectedImage] = useState(0);

  const relatedProducts = (relatedData?.products || []).filter(
    (p) => p._id !== product?._id,
  );

  const images =
    product?.images?.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop",
        ];

  const handleThumbnailClick = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  const handlePrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const discount =
    product?.downprice && product?.price
      ? `${Math.round(((product.downprice - product.price) / product.downprice) * 100)}%`
      : null;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 4.5;

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push(
        `/login?callbackUrl=/product?${id ? `id=${id}` : `slug=${slug}`}`,
      );
      return;
    }
    try {
      await addToCart({ productId: product._id, quantity }).unwrap();
      toast("Added to cart", {
        description: (
          <div className="flex items-center w-full gap-4 mt-2 p-2 bg-slate-50 rounded-md dark:bg-black">
            <img
              src={
                product?.images ||
                "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2ViJTIwZGVzaWdufGVufDB8fDB8fHww"
              }
              alt="Wireless Headphones"
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {product.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Qty: {quantity}
              </p>
            </div>
          </div>
        ),
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!newReview.comment) return;

    try {
      await addReview({
        product: product._id,
        user: session.user.id,
        rating: Number(newReview.rating),
        comment: newReview.comment,
      }).unwrap();
      setNewReview({ rating: 5, comment: "" });
      setIsAddingReview(false);
      toast.success("Review published");
    } catch {
      toast.error("Failed to publish review");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button className="mt-4 bg-[#ff6f00]" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-20">
      {session?.user?.role === "seller" && (
        <div className="flex justify-end">
          <Button
            onClick={() => router.push("/seller/products/new")}
            className="bg-[#ff6f00] hover:bg-[#e66400] rounded-lg gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            New Product
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full space-y-4 sticky top-6"
        >
          <div className="relative group">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <ImageZoom
                    src={images[selectedImage]}
                    zoomSrc={images[selectedImage]}
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleThumbnailClick(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i === selectedImage
                            ? "w-4 bg-orange-500"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {images.map((src, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedImage
                      ? "border-orange-500 ring-2 ring-orange-500/20 shadow-md"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === selectedImage && (
                    <div className="absolute inset-0 bg-orange-500/5" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 lg:pl-4"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {product.stock > 0 && (
                <Badge className="bg-emerald-500 text-white font-semibold text-xs uppercase border-none px-3 py-0.5 tracking-wider">
                  In Stock
                </Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <RatingStars rating={avgRating} size="size-3.5" />
                <span className="text-foreground font-bold ml-1">
                  {avgRating.toFixed(1)}
                </span>
                <span>({reviews.length} reviews)</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
              {product.name}
            </h1>
            {product.category?.name && (
              <p className="text-lg text-muted-foreground font-medium">
                {product.category.name}
              </p>
            )}
          </div>

          <Separator />

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-black tracking-tight text-orange-500">
              Rs. {Number(product.price).toLocaleString()}
            </span>
            {product.downprice && (
              <>
                <span className="text-lg line-through text-muted-foreground font-medium">
                  Rs. {Number(product.downprice).toLocaleString()}
                </span>
                {discount && (
                  <Badge className="text-xs font-black bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2.5 py-1">
                    -{discount}
                  </Badge>
                )}
              </>
            )}
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[360px] bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="description">Overview</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent
              value="description"
              className="pt-4 text-sm text-muted-foreground leading-relaxed"
            >
              <p>{product.description}</p>
              <div className="pt-3 flex items-center gap-2 text-xs font-semibold text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </div>
            </TabsContent>
            <TabsContent
              value="shipping"
              className="pt-4 space-y-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <Truck className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Free express shipping on orders over Rs. 1,000.</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <RotateCcw className="w-5 h-5 text-orange-500 shrink-0" />
                <span>30-day return policy.</span>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold">Quantity</span>
              <div className="flex items-center border border-muted rounded-xl bg-muted/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-muted text-lg font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-5 text-sm font-black min-w-12 text-center border-x border-muted">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-4 py-2 hover:bg-muted text-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="lg"
              disabled={product.stock <= 0 || addingToCart}
              onClick={handleAddToCart}
              className="flex-1 gap-2 font-bold text-base bg-orange-500 hover:bg-orange-600 h-13 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {product.stock <= 0
                ? "Out of Stock"
                : addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
            </Button>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-13 w-13 rounded-xl border-muted hover:border-muted-foreground/30"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-13 w-13 rounded-xl border-muted hover:border-muted-foreground/30"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 rounded-2xl border border-muted">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
              </div>
              <span className="font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
              </div>
              <span className="font-medium">Quality Guaranteed</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pt-10 border-t border-muted space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold flex items-center gap-2">
              Customer Reviews
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                {reviews.length}
              </span>
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAddingReview(!isAddingReview)}
            className={`gap-2 rounded-xl transition-all ${
              isAddingReview
                ? "border-muted-foreground/30"
                : "border-orange-500/30 text-orange-600 hover:bg-orange-500/5"
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            {isAddingReview ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        <AnimatePresence>
          {isAddingReview && (
            <motion.form
              onSubmit={handleAddReviewSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-muted/50 to-background border border-muted p-6 rounded-2xl space-y-5 max-w-xl overflow-hidden"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Rating
                </label>
                <RatingStars
                  rating={newReview.rating}
                  onRatingChange={(val) =>
                    setNewReview((prev) => ({ ...prev, rating: val }))
                  }
                  size="size-7"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Comment
                </label>
                <Textarea
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  className="rounded-xl resize-none focus-visible:ring-orange-500/30"
                  placeholder="Share your thoughts about this product..."
                />
              </div>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/20"
              >
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                Publish Review
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No reviews yet. Be the first!
              </p>
            </motion.div>
          ) : (
            reviews.map((rev, idx) => (
              <motion.div
                key={rev._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 border border-muted bg-card rounded-2xl space-y-3 hover:border-muted-foreground/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      {(rev.user?.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-1.5">
                        {rev.user?.name || "Customer"}
                        <span className="text-emerald-500 text-[10px] bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 font-medium">
                          <CheckCircle2 className="w-2.5 h-2.5 inline mr-0.5" />
                          Verified
                        </span>
                      </h4>
                      <RatingStars rating={rev.rating} size="size-3" />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rev.comment}
                </p>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 pt-6 border-t border-muted"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Related Products</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1"
              onClick={() => router.push(`/${product.category?.slug || product.category?._id}`)}
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p._id}
                id={p._id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                originalPrice={p.downprice}
                image={p.images?.[0]}
                inStock={p.stock > 0}
                description={p.description}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
