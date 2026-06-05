"use client";

import { useMemo, useState } from "react";
import {
  Carousel,
  Slider,
  SliderContainer,
  ThumbsSlider,
} from "@/components/ui/carousel";
import ImageZoom from "@/components/ui/ZoomImage";
import { RatingStars } from "@/components/ui/rating-stars";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const PRODUCT = {
  _id: "p1",
  name: "Handcrafted Leather Weekender Bag",
  price: 189,
  downprice: 249,
  discount: "24%",
  rating: 4.7,
  reviews: 128,
  sold: 340,
  stock: 12,
  description:
    "Full-grain vegetable-tanned leather, brass hardware, and a cotton canvas lining. Built for the weekend explorer who demands quality without compromise. Each bag develops a unique patina over time — the hallmark of genuine craftsmanship.",
  features: [
    "Full-grain vegetable-tanned leather",
    "Solid brass zipper & hardware",
    "Removable shoe compartment",
    "Adjustable & detachable shoulder strap",
    "Cotton canvas interior lining",
    "Fits 15 laptop",
  ],
  images: [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop",
  ],
  colors: ["#2C2C2A", "#8B5E3C", "#1B3A5C"],
  colorNames: ["Midnight Black", "Cognac Brown", "Navy Blue"],
};

const RELATED = [
  {
    _id: "r1",
    name: "Canvas Tote Bag",
    price: 79,
    downprice: 99,
    discount: "20%",
    rating: 4.5,
    reviews: 84,
    sold: 210,
    stock: 5,
    description: "Waxed canvas with leather handles.",
    badge: "Popular",
  },
  {
    _id: "r2",
    name: "Leather Card Holder",
    price: 39,
    downprice: 59,
    discount: "34%",
    rating: 4.8,
    reviews: 203,
    sold: 620,
    stock: 30,
    description: "Slim profile, holds up to 8 cards.",
    badge: "Bestseller",
  },
  {
    _id: "r3",
    name: "Crossbody Satchel",
    price: 129,
    downprice: 169,
    discount: "24%",
    rating: 4.3,
    reviews: 61,
    sold: 145,
    stock: 8,
    description: "Compact everyday carry in full-grain leather.",
    badge: "New",
  },
  {
    _id: "r4",
    name: "Waxed Backpack",
    price: 219,
    downprice: 279,
    discount: "22%",
    rating: 4.6,
    reviews: 97,
    sold: 188,
    stock: 0,
    description: "Roll-top closure, 25L capacity.",
    badge: "Sale",
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    date: "May 2025",
    title: "Worth every penny",
    body: "The leather quality is exceptional. I've had cheaper bags fall apart in months — this one just keeps getting better.",
    avatar: "SM",
  },
  {
    id: 2,
    name: "James K.",
    rating: 4,
    date: "Apr 2025",
    title: "Beautiful bag, minor strap issue",
    body: "Absolutely stunning bag. Leather smell is incredible. Docked one star because the shoulder strap adjustment is a little stiff out of the box.",
    avatar: "JK",
  },
  {
    id: 3,
    name: "Priya L.",
    rating: 5,
    date: "Mar 2025",
    title: "Perfect travel companion",
    body: "Flew to three countries with this. Fits everything I need for a 3-day trip. The shoe compartment is genius.",
    avatar: "PL",
  },
];

function ProductCard({
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  badge,
  sold,
  inStock,
  description,
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        <img
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop"
          alt={name}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="secondary">{badge}</Badge>
        </div>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="outline">Out of stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="space-y-2 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={rating} />
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">${price}</span>
          <span className="text-xs text-muted-foreground line-through">
            ${originalPrice}
          </span>
          <span className="text-xs font-medium text-emerald-600">
            {discount} off
          </span>
        </div>

        <p className="text-xs text-muted-foreground">{sold} sold</p>
      </CardContent>
    </Card>
  );
}

function ReviewCard({ review }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{review.avatar}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{review.name}</p>
              <span className="text-xs text-muted-foreground">
                {review.date}
              </span>
            </div>
            <div className="mt-1">
              <RatingStars rating={review.rating} />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">{review.title}</p>
          <p className="text-sm text-muted-foreground leading-6">
            {review.body}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const product = PRODUCT;
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    title: "",
    body: "",
    rating: 0,
  });

  const avgRating = useMemo(() => {
    return (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(
      1,
    );
  }, [reviews]);

  const OPTIONS = {
    loop: false,
    axis: "x",
    direction: "rtl",
  };

  function handleAddToCart() {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    if (!newReview.name || !newReview.body || !newReview.rating) return;

    const r = {
      id: Date.now(),
      name: newReview.name,
      title: newReview.title || "My review",
      body: newReview.body,
      rating: newReview.rating,
      date: "Jun 2025",
      avatar: newReview.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };

    setReviews((prev) => [r, ...prev]);
    setNewReview({ name: "", title: "", body: "", rating: 0 });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <Carousel options={OPTIONS} className="relative flex flex-col gap-2">
            <SliderContainer className="h-[460px] gap-2 rounded-xl">
              {product.images.map((src, idx) => (
                <Slider
                  key={idx}
                  className="h-full w-full min-h-0"
                  thumbnailSrc={src}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl border">
                    <ImageZoom
                      src={src}
                      zoomSrc={src}
                      zoomScale={1}
                      alt={`image-${idx}`}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                </Slider>
              ))}
            </SliderContainer>

            <ThumbsSlider
              className="w-full flex-shrink-0"
              thumbsClassName="h-[92px]"
              thumbsSliderClassName="border-border"
            />
          </Carousel>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6">
          <div className="flex items-center gap-2">
            <Badge>Bestseller</Badge>
            <span className="text-sm text-muted-foreground">
              {product.sold}+ sold
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <RatingStars rating={product.rating} />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                Based on {avgRating} avg from reviews
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-semibold">${product.price}</span>
            <span className="text-base text-muted-foreground line-through">
              ${product.downprice}
            </span>
            <Badge variant="secondary">{product.discount} off</Badge>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>

          <Separator />

          <div className="space-y-3">
            <div className="text-sm font-medium">
              Color:{" "}
              <span className="font-normal text-muted-foreground">
                {product.colorNames[selectedColor]}
              </span>
            </div>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  className={`h-9 w-9 rounded-full border transition-all ${
                    selectedColor === i
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={product.colorNames[i]}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Quantity</div>
            <div className="flex w-fit items-center rounded-md border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex h-10 w-12 items-center justify-center border-x text-sm font-medium">
                {quantity}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.stock > 5 ? "In stock" : `Only ${product.stock} left!`}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              variant={addedToCart ? "secondary" : "default"}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {addedToCart ? "Added!" : "Add to cart"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWishlist((w) => !w)}
              className={wishlist ? "text-red-500" : ""}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${wishlist ? "fill-current" : ""}`} />
            </Button>
          </div>

          <Button className="w-full" variant="outline">
            Buy now
          </Button>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Delivery & support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free delivery on orders over $150</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                <span>30-day hassle-free returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure checkout and payment protection</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <Card>
                <CardContent className="space-y-4 p-5 text-center">
                  <div className="text-5xl font-semibold">{avgRating}</div>
                  <RatingStars rating={parseFloat(avgRating)} />
                  <p className="text-sm text-muted-foreground">
                    Based on {reviews.length} reviews
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-right text-xs">5</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[68%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-right text-xs">4</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[20%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-right text-xs">3</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[8%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-right text-xs">2</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[3%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-right text-xs">1</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[1%] rounded-full bg-amber-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Write a review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reviewSubmitted && (
                      <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Thank you! Your review has been posted.
                      </div>
                    )}
                    <form className="space-y-4" onSubmit={handleSubmitReview}>
                      <div>
                        <p className="mb-2 text-sm font-medium">Your rating</p>
                        <RatingStars
                          rating={newReview.rating}
                          interactive
                          size={22}
                          onRate={(r) =>
                            setNewReview((v) => ({ ...v, rating: r }))
                          }
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          placeholder="Your name"
                          value={newReview.name}
                          onChange={(e) =>
                            setNewReview((v) => ({
                              ...v,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                        <Input
                          placeholder="Review title"
                          value={newReview.title}
                          onChange={(e) =>
                            setNewReview((v) => ({
                              ...v,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Share your experience with this product"
                        value={newReview.body}
                        onChange={(e) =>
                          setNewReview((v) => ({ ...v, body: e.target.value }))
                        }
                        required
                      />
                      <Button type="submit">Post review</Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="space-y-0 p-5">
                {[
                  ["Material", "Full-grain vegetable-tanned leather"],
                  ["Hardware", "Solid brass anti-tarnish coated"],
                  ["Lining", "Cotton canvas"],
                  ["Dimensions", "22 x 11 x 11 L x H x W"],
                  ["Weight", "2.4 kg / 5.3 lbs"],
                  ["Capacity", "40 litres"],
                  ["Laptop fit", "Up to 15 laptop"],
                  ["Origin", "Handcrafted in León, Mexico"],
                  ["Warranty", "Lifetime craftsmanship guarantee"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-3 border-b py-3 last:border-b-0 sm:grid-cols-[180px_1fr]"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
                <div className="mt-5">
                  <div className="mb-3 text-sm font-medium">Features</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Star className="mt-0.5 h-4 w-4 text-emerald-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16 space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">You may also like</h2>
          <Button variant="link" className="px-0">
            View all
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED.map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              price={product.price}
              originalPrice={product.downprice}
              discount={product.discount || "20%"}
              rating={product.rating || 4.5}
              reviews={product.reviews || 0}
              badge="Bestseller"
              sold={product.sold || 0}
              inStock={product.stock > 0}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
