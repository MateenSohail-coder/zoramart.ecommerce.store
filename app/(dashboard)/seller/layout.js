import DashboardShell from "../_components/DashboardShell";

export const metadata = {
  title: "Seller Dashboard",
  description:
    "Manage your store, track orders, view earnings, and optimize your seller performance on ZoraMart.",
};

export default function SellerDashboardLayout({ children }) {
  return <DashboardShell role="seller">{children}</DashboardShell>;
}
