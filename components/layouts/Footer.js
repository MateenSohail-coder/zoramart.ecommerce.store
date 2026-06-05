import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const footerLinks = {
    shop: [
      { label: "All Categories", href: "#" },
      { label: "New Arrivals", href: "#" },
      { label: "Best Sellers", href: "#" },
      { label: "Deals & Offers", href: "#" },
    ],
    help: [
      { label: "Help Center", href: "#" },
      { label: "Order Tracking", href: "#" },
      { label: "Returns & Refunds", href: "#" },
      { label: "Shipping Info", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    account: [
      { label: "My Account", href: "#" },
      { label: "Wishlist", href: "#" },
      { label: "Cart", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  };

  return (
    <footer className="bg-[#2d3235] border-t-6 border-t-[#ff6f00] border-b-0 font-dmsans text-white  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Shop smarter with trusted deals.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70 max-w-md">
              Discover quality products, fast support, and a smooth shopping
              experience built for everyday buyers.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-[#ff6f00] text-white hover:bg-[#ff6f00]/90 rounded-full px-6">
                Start Shopping
              </Button>
              <Button
                variant="outline"
                className="border-white/15 text-white bg-white/5 hover:bg-white/10 rounded-full px-6"
              >
                Contact Support
              </Button>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ff6f00] mb-4">
                  Shop
                </h3>
                <ul className="space-y-3">
                  {footerLinks.shop.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-[#ff6f00] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ff6f00] mb-4">
                  Help
                </h3>
                <ul className="space-y-3">
                  {footerLinks.help.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-[#ff6f00] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ff6f00] mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-[#ff6f00] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ff6f00] mb-4">
                  Account
                </h3>
                <ul className="space-y-3">
                  {footerLinks.account.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-[#ff6f00] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10">
          <Separator className="bg-white/10" />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/60">
            © 2026 Shadcn Space. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="#"
              className="text-white/60 hover:text-[#ff6f00] transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-[#ff6f00] transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-[#ff6f00] transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
