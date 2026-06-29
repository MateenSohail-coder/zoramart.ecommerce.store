import DashboardShell from "../_components/DashboardShell";

export const metadata = {
  title: "User Dashboard",
};

export default function UserDashboardLayout({ children }) {
  return <DashboardShell role="user">{children}</DashboardShell>;
}
