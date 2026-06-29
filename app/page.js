"use client";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";
import HeroSection from "@/components/layouts/heroSection";
import HomeCategories from "@/components/layouts/homeCategories";
import HomeProducts from "@/components/layouts/HomeProducts";
import SearchResults from "@/components/layouts/SearchResults";
import Navbar from "@/components/layouts/Navbar";
import TopBar from "@/components/layouts/topBar";

export default function Home() {
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
