import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export const metadata = {
  title: "Category Page",
};

export default function CategoryPageLayout({ children }) {
  return <main className="font-dmsans ">
    <Navbar/>
    {children}
    <Footer/>
    </main>;
}
