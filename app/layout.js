import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/themeProvider";
import Providers from "@/components/common/sessionProvider";
import { Toaster } from "@/components/ui/sonner";
import RTKProviders from "@/components/providers";
import Navbar from "@/components/layouts/Navbar";
import TopBar from "@/components/layouts/topBar";
import { TooltipProviders } from "@/components/Tprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "ZoraMart — Shop Smarter, Live Better",
    template: "%s | ZoraMart",
  },
  description:
    "Discover premium products at unbeatable prices. ZoraMart is your trusted online marketplace for fashion, electronics, home goods & more — with fast delivery across Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <Providers>
        <body className="min-h-full flex flex-col transition-all">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RTKProviders>
              {/* <TopBar />
              <Navbar /> */}
              <TooltipProviders>{children}</TooltipProviders>
            </RTKProviders>
            <Toaster position="top-center" />
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
