import DashboardShell from "../_components/DashboardShell";

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Oversee platform operations, manage users, sellers, products, orders, and analytics on ZoraMart.",
};

export default function AdminDashboardLayout({ children }) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
