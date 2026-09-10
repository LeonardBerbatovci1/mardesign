"use client";

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

/** Sticky action bar pinned to the bottom of every editor. */
export function SaveBar({
  dirty,
  pending,
  status,
  onSave,
  onRevert,
  onReset,
}: {
  dirty: boolean;
  pending: boolean;
  status: Status;
  onSave: () => void;
  onRevert: () => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 mt-10 -mx-4 border-t border-[var(--a-border)] bg-white/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || pending}
          className="admin-btn admin-btn-primary"
        >
          {status.kind === "saving" ? "Saving…" : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onRevert}
          disabled={!dirty || pending}
          className="admin-btn admin-btn-ghost"
        >
          Undo edits
        </button>

        <p className="order-last w-full text-sm sm:order-none sm:w-auto">
          {status.kind === "error" && (
            <span className="text-[var(--a-danger)]">
              Couldn’t save — {status.message}
            </span>
          )}
          {status.kind === "saved" && !dirty && (
            <span className="text-[var(--a-brand)]">
              ✓ Saved and live on the site
            </span>
          )}
          {dirty && status.kind !== "error" && (
            <span className="text-[var(--a-muted)]">Unsaved changes</span>
          )}
        </p>

        <button
          type="button"
          onClick={onReset}
          disabled={pending}
          className="admin-btn admin-btn-danger ml-auto"
        >
          Restore original
        </button>
      </div>
    </div>
  );
}
