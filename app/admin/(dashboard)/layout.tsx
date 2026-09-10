import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

import "../admin.css";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware gates this too; belt-and-braces in case the matcher changes.
  if (!(await isAuthenticated())) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
