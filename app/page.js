"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";
import HeroSection from "@/components/layouts/heroSection";
import HomeCategories from "@/components/layouts/homeCategories";
import HomeProducts from "@/components/layouts/HomeProducts";
import SearchResults from "@/components/layouts/SearchResults";
import Navbar from "@/components/layouts/Navbar";
import TopBar from "@/components/layouts/topBar";

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  return (
    <div>
      <TopBar />
      <Navbar />
      {searchQuery ? (
        <SearchResults query={searchQuery} />
      ) : (
        <>
          <HeroSection />
          <HomeCategories />
          <HomeProducts />
        </>
      )}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
