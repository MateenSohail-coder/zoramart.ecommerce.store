import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";

export const metadata = {
  title: "Checkout | ZoraMart",
  description: "Complete your purchase",
};

export default function CheckoutLayout({ children }) {
  return (
    <main className="font-dmsans min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
