import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export const metadata = {
  title: "Browse Products",
  description:
    "Shop by category on ZoraMart — find the perfect product from our curated collection of fashion, electronics, home essentials & more.",
};

export default function CategoryPageLayout({ children }) {
  return <main className="font-dmsans ">
    <Navbar/>
    {children}
    <Footer/>
    </main>;
}
