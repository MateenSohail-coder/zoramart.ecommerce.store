import DashboardShell from "../_components/DashboardShell";

export const metadata = {
  title: "Seller Dashboard",
};

export default function SellerDashboardLayout({ children }) {
  return <DashboardShell role="seller">{children}</DashboardShell>;
}
