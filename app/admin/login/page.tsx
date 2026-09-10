"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { loginAction, type ActionResult } from "@/lib/admin-actions";
import { LogoMark } from "@/components/Logo";

import "../admin.css";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(loginAction, null);

  return (
    <form action={action} className="admin-card w-full max-w-sm">
      <div className="mb-6 flex items-center gap-3">
        <LogoMark className="h-9 w-9 text-[var(--a-brand)]" />
        <div className="leading-tight">
          <p className="font-bold">Mardesign</p>
          <p className="text-sm text-[var(--a-muted)]">Content dashboard</p>
        </div>
      </div>

      <input type="hidden" name="next" value={next} />
      <label className="admin-label" htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="admin-input" />

      {state && !state.ok && <p className="mt-3 text-sm text-[var(--a-danger)]">{state.error}</p>}

      <button type="submit" disabled={pending} className="admin-btn admin-btn-primary mt-5 w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="admin-root grid min-h-dvh place-items-center p-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
