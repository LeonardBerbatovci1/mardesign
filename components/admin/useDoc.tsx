"use client";

import { useCallback, useMemo, useState, useTransition } from "react";

import { resetDocAction, saveDocAction } from "@/lib/admin-actions";
import type { DocName } from "@/lib/store";

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

/**
 * Local editing state for one document, plus save/reset wired to the server
 * actions. Every admin form is built on this: it holds a working copy, tracks
 * whether it differs from what was loaded, and serialises to JSON on save.
 */
export function useDoc<T>(doc: DocName, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [baseline, setBaseline] = useState<T>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(baseline),
    [value, baseline],
  );

  const save = useCallback(() => {
    setStatus({ kind: "saving" });
    startTransition(async () => {
      const res = await saveDocAction(doc, JSON.stringify(value));
      if (res.ok) {
        setBaseline(value);
        setStatus({ kind: "saved" });
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }, [doc, value]);

  const reset = useCallback(() => {
    if (!confirm("Restore this page to the original content? Your changes will be lost.")) {
      return;
    }
    setStatus({ kind: "saving" });
    startTransition(async () => {
      const res = await resetDocAction(doc);
      if (res.ok) {
        location.reload();
      } else {
        setStatus({ kind: "error", message: res.error });
      }
    });
  }, [doc]);

  const revert = useCallback(() => setValue(baseline), [baseline]);

  // Ready-made props for <SaveBar {...d.bar} />
  const bar = { dirty, status, pending, onSave: save, onRevert: revert, onReset: reset };

  return { value, setValue, dirty, status, pending, save, reset, revert, bar };
}

/** Immutable set-by-path: update(v, ["hero", "title"], "New") */
export function setPath<T>(obj: T, path: (string | number)[], next: unknown): T {
  if (path.length === 0) return next as T;
  const [head, ...rest] = path;
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  clone[head] = setPath(clone[head], rest, next);
  return clone;
}
