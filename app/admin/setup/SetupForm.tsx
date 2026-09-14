"use client";

import { useActionState } from "react";

import { setupAction, type ActionResult } from "@/lib/admin-actions";
import { LogoMark } from "@/components/Logo";

export function SetupForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    setupAction,
    null,
  );

  return (
    <form action={action} className="admin-card w-full max-w-sm">
      <div className="mb-6 flex items-center gap-3">
        <LogoMark className="h-9 w-9 text-[var(--a-brand)]" />
        <div className="leading-tight">
          <p className="font-bold">Mardesign</p>
          <p className="text-sm text-[var(--a-muted)]">Set up your dashboard</p>
        </div>
      </div>

      <p className="mb-5 text-sm text-[var(--a-muted)]">
        No login exists yet. Create the first account — this becomes your
        dashboard email and password, no hosting panel needed.
      </p>

      <label className="admin-label" htmlFor="name">Your name</label>
      <input id="name" name="name" required autoFocus className="admin-input" />

      <label className="admin-label mt-4" htmlFor="email">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        className="admin-input"
      />

      <label className="admin-label mt-4" htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        className="admin-input"
      />

      <label className="admin-label mt-4" htmlFor="confirm">Confirm password</label>
      <input
        id="confirm"
        name="confirm"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        className="admin-input"
      />

      {state && !state.ok && <p className="mt-3 text-sm text-[var(--a-danger)]">{state.error}</p>}

      <button type="submit" disabled={pending} className="admin-btn admin-btn-primary mt-5 w-full">
        {pending ? "Creating account…" : "Create account & sign in"}
      </button>
    </form>
  );
}
