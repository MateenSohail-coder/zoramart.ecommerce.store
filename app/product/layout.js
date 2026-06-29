import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";

export const metadata = {
  title: "Product Details",
  description:
    "Explore detailed product information, customer reviews, and pricing. Shop with confidence on ZoraMart.",
};

export default function ProductPageLayout({ children }) {
  return (
    <main className="font-dmsans">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
