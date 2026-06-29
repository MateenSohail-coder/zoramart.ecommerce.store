import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";

export const metadata = {
  title: "Shopping Cart | ZoraMart",
  description: "Review and manage your shopping cart",
};

export default function CartLayout({ children }) {
  return (
    <main className="font-dmsans min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
