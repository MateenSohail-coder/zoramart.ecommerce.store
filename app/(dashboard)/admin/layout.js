import DashboardShell from "../_components/DashboardShell";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardLayout({ children }) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
