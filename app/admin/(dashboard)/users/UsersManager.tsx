"use client";

import { useState, useTransition } from "react";

import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/lib/admin-actions";
import type { PublicUser } from "@/lib/users";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function UsersManager({
  initial,
  currentEmail,
  ownerEmail,
}: {
  initial: PublicUser[];
  currentEmail: string | null;
  ownerEmail: string | null;
}) {
  const [users, setUsers] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  function addUser(formData: FormData) {
    setError(null);
    start(async () => {
      const res = await createUserAction(formData);
      if (res.ok) {
        setUsers((u) => [...u, res.user]);
        setAdding(false);
      } else {
        setError(res.error);
      }
    });
  }

  function saveEdit(id: string, formData: FormData) {
    setError(null);
    const patch = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    start(async () => {
      const res = await updateUserAction(id, patch);
      if (res.ok) {
        setUsers((u) => u.map((x) => (x.id === id ? res.user : x)));
        setEditingId(null);
      } else {
        setError(res.error);
      }
    });
  }

  function remove(user: PublicUser) {
    const isSelf = user.email === currentEmail;
    const warning = isSelf
      ? `Delete your own account (${user.email})? You'll stay signed in until your session expires, but you won't be able to log back in with it.`
      : `Delete ${user.name} (${user.email})? They'll lose dashboard access immediately.`;
    if (!confirm(warning)) return;
    setError(null);
    start(async () => {
      const res = await deleteUserAction(user.id);
      if (res.ok) setUsers((u) => u.filter((x) => x.id !== user.id));
      else setError(res.error);
    });
  }

  return (
    <div className="space-y-4">
      {ownerEmail && (
        <section className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="admin-section-title">
                Owner login <span className="admin-chip ml-1">Always works</span>
              </p>
              <p className="mt-1 text-sm text-[var(--a-muted)]">
                {ownerEmail}
                {ownerEmail === currentEmail && " — this is you right now"}
              </p>
            </div>
            <p className="max-w-xs text-xs text-[var(--a-faint)]">
              Set in the hosting environment, not here. It's the recovery
              login if this list is ever empty — see docs/DEPLOY-HOSTINGER.md.
            </p>
          </div>
        </section>
      )}

      <section className="admin-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="admin-section-title">Team members</h2>
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="admin-btn admin-btn-primary"
            >
              + Add user
            </button>
          )}
        </div>

        {error && <p className="mb-3 text-sm text-[var(--a-danger)]">{error}</p>}

        {adding && (
          <form
            action={addUser}
            className="admin-item mb-3 grid gap-3 sm:grid-cols-3"
          >
            <div>
              <label className="admin-label" htmlFor="new-name">Name</label>
              <input id="new-name" name="name" required className="admin-input" />
            </div>
            <div>
              <label className="admin-label" htmlFor="new-email">Email</label>
              <input id="new-email" name="email" type="email" required className="admin-input" />
            </div>
            <div>
              <label className="admin-label" htmlFor="new-password">Password</label>
              <input
                id="new-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="admin-input"
              />
            </div>
            <div className="flex gap-2 sm:col-span-3">
              <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
                {pending ? "Adding…" : "Add user"}
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="admin-btn admin-btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {users.length === 0 ? (
          <p className="text-sm text-[var(--a-faint)]">
            No named users yet — everyone signs in with the owner login above.
          </p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li key={user.id} className="admin-item">
                {editingId === user.id ? (
                  <form
                    action={(fd) => saveEdit(user.id, fd)}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    <div>
                      <label className="admin-label">Name</label>
                      <input
                        name="name"
                        defaultValue={user.name}
                        required
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Email</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">New password</label>
                      <input
                        name="password"
                        type="password"
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Leave blank to keep it"
                        className="admin-input"
                      />
                    </div>
                    <div className="flex gap-2 sm:col-span-3">
                      <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
                        {pending ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="admin-btn admin-btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {user.name}
                        {user.email === currentEmail && (
                          <span className="admin-chip ml-2">You</span>
                        )}
                      </p>
                      <p className="text-sm text-[var(--a-muted)]">{user.email}</p>
                      <p className="text-xs text-[var(--a-faint)]">
                        Added {fmtDate(user.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingId(user.id)}
                        className="admin-btn admin-btn-ghost"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(user)}
                        disabled={pending}
                        className="admin-btn admin-btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
