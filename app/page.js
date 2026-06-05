"use client";
import { ModeToggle } from "@/components/common/modeToggle";
import Footer from "@/components/layouts/Footer";
import HeroSection from "@/components/layouts/heroSection";
import HomeCategories from "@/components/layouts/homeCategories";
import HomeProducts from "@/components/layouts/HomeProducts";
import Navbar from "@/components/layouts/Navbar";
import TopBar from "@/components/layouts/topBar";
import SignIn from "@/components/signin";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/productCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetCategoriesQuery } from "@/features/categories/categoryApi";
import {
  useAddProductMutation,
  useDeleteProductsMutation,
  useGetProductsQuery,
  useUpdateProductsMutation,
} from "@/features/product/productApi";
import { verifyOtp } from "@/lib/verify-otp";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
   const { data: session } = useSession();
   const [id, setid] = useState("");
   const [updateProducts] = useUpdateProductsMutation();
   const [addProduct] = useAddProductMutation();
   const [deleteProducts] = useDeleteProductsMutation();
   const { data: categories, isLoading, error } = useGetCategoriesQuery(id);
   if (session?.user) {
     console.log(session.user);
   }
   async function sub() {
     const res = await verifyOtp("6a0c96fb7ec06ebf8f7ab064", 888162);
     console.log(res);
   }
   async function get() {
     await setid("6a1463d2b16f53bdefe0383f");
     console.log(categories);
   }
   async function add() {
     const data = {
       // FIX: Name ko har baar unique banaya taaki database unique constraints na tootein
       name: `samsung-${Math.floor(Math.random() * 1000)}`,
       description: "this is samsung",
       images: ["http..", "http..."],
       price: 500,
       downprice: 600,
       category: "6a11c4d45c54bde5ac6b8258",
       seller: "6a11c4d45c54bde5ac6b8258",
       stock: 5,
     };

     try {
       // .unwrap() use karne se agar koi error aayega to wo direct yahan catch hoga
       await addProduct(data).unwrap();
     } catch (err) {
       console.error("Component level par error aya:", err);
     }
   }

  return (
    <div className="">
      <TopBar />
      <Navbar />
      <HeroSection />
      <HomeCategories />
      <HomeProducts />
      <div className="grid md:grid-cols-5 grid-cols-2 gap-2 py-8 px-2">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
      <button onClick={() => get()}>get data</button>
      <Footer />
    </div>
  );
}

