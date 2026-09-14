import { redirect } from "next/navigation";

import { getSessionEmail } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

import "../admin.css";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware gates this too; belt-and-braces in case the matcher changes.
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");
  return <AdminShell email={email}>{children}</AdminShell>;
}
