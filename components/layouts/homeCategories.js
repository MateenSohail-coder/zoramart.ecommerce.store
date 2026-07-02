import React from "react";
import Image from "next/image";
import { Card } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import Link from "next/link";

const categories = [
  {
    name: "Automotive & Motorbike",
    slug: "automotive-and-motorbike",
    href: "/category/automotive-and-motorbike",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Groceries & Pets",
    slug: "groceries-and-pets",
    href: "/category/groceries-and-pets",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Health & Beauty",
    slug: "health-and-beauty",
    href: "/category/health-and-beauty",
    image:
      "https://images.unsplash.com/photo-1556911073-52527ac43761?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhlYWx0aCUyMGFuZCUyMGJlYXV0eXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Home & Lifestyle",
    slug: "home-and-lifestyle",
    href: "/category/home-and-lifestyle",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Men's Fashion",
    slug: "mens-fashion",
    href: "/category/mens-fashion",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Mother & Baby",
    slug: "mother-and-baby",
    href: "/category/mother-and-baby",
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Phones & Tablets",
    slug: "phones-and-tablets",
    href: "/category/phones-and-tablets",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Sports & Outdoor",
    slug: "sports-and-outdoor",
    href: "/category/sports-and-outdoor",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Watches & Jewellery",
    slug: "watches-bags-and-jewellery",
    href: "/category/watches-bags-and-jewellery",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop&q=60",
  },
  {
    name: "Women's Fashion",
    slug: "womens-fashion",
    href: "/category/womens-fashion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60",
  },
];

export default function HomeCategories() {
  return (
    <section className="w-full py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-sora font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Shop by Category
          </h2>
          <div className=" w-20 rounded-full bg-[#ff6f00]" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group relative cursor-pointer overflow-hidden border-none bg-transparent transition-all duration-300 hover:-translate-y-1">
                <AspectRatio
                  ratio={1 / 1}
                  className="overflow-hidden rounded-xl"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4">
                    <p className="text-center bg-[#ff6f00] rounded-full font-dmsans text-sm font-medium tracking-wide text-white antialiased drop-shadow-md sm:text-base">
                      {category.name}
                    </p>

                    <div className="mx-auto mt-2 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-1/3" />
                  </div>
                </AspectRatio>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
