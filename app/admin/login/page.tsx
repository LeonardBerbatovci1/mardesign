import { Suspense } from "react";
import { redirect } from "next/navigation";

import { needsSetup } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

import "../admin.css";

// needsSetup() reads env vars and a file on disk, not a Next dynamic API, so
// without this the redirect decision would be evaluated once at build time
// and baked into a static page instead of checked on every request.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Nobody can log in yet (no owner env pair, no stored users) — send whoever
  // arrives here to create the first account instead of showing a dead end.
  if (await needsSetup()) redirect("/admin/setup");

  return (
    <div className="admin-root grid min-h-dvh place-items-center p-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
