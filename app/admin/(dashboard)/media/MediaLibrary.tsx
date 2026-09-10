"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { deleteMediaAction, uploadMediaAction } from "@/lib/admin-actions";
import type { StoredFile } from "@/lib/uploads";

export function MediaLibrary({ initial }: { initial: StoredFile[] }) {
  const [files, setFiles] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function upload(list: FileList) {
    setError(null);
    start(async () => {
      for (const file of Array.from(list)) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await uploadMediaAction(fd);
        if ("url" in res && res.ok) {
          setFiles((f) => [
            { name: res.url.split("/").pop()!, url: res.url, size: file.size, modified: Date.now() },
            ...f,
          ]);
        } else if (!res.ok) {
          setError(res.error);
        }
      }
    });
  }

  function remove(name: string) {
    if (!confirm(`Delete ${name}? Pages still using it will show a broken image.`)) return;
    start(async () => {
      const res = await deleteMediaAction(name);
      if (res.ok) setFiles((f) => f.filter((x) => x.name !== name));
      else setError(res.error);
    });
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(new URL(url, location.origin).href);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard may be blocked */
    }
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={pending}
        className="admin-btn admin-btn-primary"
      >
        {pending ? "Uploading…" : "Upload images"}
      </button>
      {error && <p className="mt-2 text-sm text-[var(--a-danger)]">{error}</p>}

      {files.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--a-faint)]">Nothing uploaded yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {files.map((f) => (
            <li key={f.name} className="admin-card p-3">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-[#eef2f2]">
                <Image src={f.url} alt={f.name} fill sizes="240px" className="object-contain" unoptimized />
              </div>
              <p className="mt-2 truncate text-xs font-medium" title={f.name}>{f.name}</p>
              <p className="text-[0.7rem] text-[var(--a-faint)]">{(f.size / 1024).toFixed(0)} KB</p>
              <div className="mt-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => copy(f.url)}
                  className="rounded-md px-2 py-1 text-[0.72rem] font-semibold text-[var(--a-brand)] hover:bg-[var(--a-brand-tint)]"
                >
                  {copied === f.url ? "Copied ✓" : "Copy link"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(f.name)}
                  className="rounded-md px-2 py-1 text-[0.72rem] font-semibold text-[var(--a-danger)] hover:bg-[#fbeceb]"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
