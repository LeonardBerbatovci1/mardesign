"use client";

import Image from "next/image";
import { useId, useRef, useState, useTransition } from "react";

import { uploadMediaAction } from "@/lib/admin-actions";

export type ImageValue = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

/**
 * Shows the current image and lets the client replace it by uploading a new
 * file. On upload the real pixel dimensions come back from the server and are
 * stored with the reference, so layouts keep reserving the right space.
 */
export function ImageField({
  label,
  value,
  onChange,
  withAlt = false,
  hint,
}: {
  label: string;
  value: ImageValue;
  onChange: (v: ImageValue) => void;
  withAlt?: boolean;
  hint?: string;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function pick(file: File) {
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      const res = await uploadMediaAction(fd);
      if ("url" in res && res.ok) {
        onChange({ ...value, src: res.url, width: res.width, height: res.height });
      } else if (!res.ok) {
        setError(res.error);
      }
    });
  }

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-[var(--a-border)] bg-[#eef2f2]">
          {value.src ? (
            <Image
              src={value.src}
              alt=""
              fill
              sizes="112px"
              className="object-contain"
              unoptimized
            />
          ) : (
            <span className="grid h-full place-items-center text-xs text-[var(--a-faint)]">
              none
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pick(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="admin-btn admin-btn-ghost"
          >
            {pending ? "Uploading…" : "Upload new image"}
          </button>
          <p className="mt-1.5 break-all text-xs text-[var(--a-faint)]">
            {value.src || "No image set"}
            {value.width ? ` · ${value.width}×${value.height}` : ""}
          </p>
          {hint && <p className="mt-1 text-xs text-[var(--a-faint)]">{hint}</p>}
          {error && <p className="mt-1 text-xs text-[var(--a-danger)]">{error}</p>}

          {withAlt && (
            <input
              className="admin-input mt-2"
              placeholder="Describe the image (for accessibility & SEO)"
              value={value.alt ?? ""}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
