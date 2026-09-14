import { redirect } from "next/navigation";

import { needsSetup } from "@/lib/auth";
import { SetupForm } from "./SetupForm";

import "../admin.css";

// Same reason as app/admin/login/page.tsx: needsSetup() must be checked on
// every request, not frozen into a static page at build time.
export const dynamic = "force-dynamic";

export default async function SetupPage() {
  // Once an owner pair exists in the environment, or a first user has been
  // created, this page has nothing left to do — the real login takes over
  // and setup can't be re-run to sneak in a second account.
  if (!(await needsSetup())) redirect("/admin/login");

  return (
    <div className="admin-root grid min-h-dvh place-items-center p-6">
      <SetupForm />
    </div>
  );
}
