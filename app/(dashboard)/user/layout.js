import DashboardShell from "../_components/DashboardShell";

export const metadata = {
  title: "My Account",
  description:
    "Manage your profile, orders, wishlist, and account settings on ZoraMart.",
};

export default function UserDashboardLayout({ children }) {
  return <DashboardShell role="user">{children}</DashboardShell>;
}
