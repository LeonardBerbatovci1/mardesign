"use client";

import { useId } from "react";

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="admin-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="admin-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-[var(--a-faint)]">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="admin-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="admin-input"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-[var(--a-faint)]">{hint}</p>}
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useId();
  const valid = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
  return (
    <div>
      <label className="admin-label" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} colour picker`}
          value={valid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-[var(--a-border-strong)] bg-white p-1"
        />
        <input
          id={id}
          className="admin-input font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {hint && <p className="mt-1 text-xs text-[var(--a-faint)]">{hint}</p>}
      {!valid && (
        <p className="mt-1 text-xs text-[var(--a-danger)]">Enter a hex colour, e.g. #1b4755</p>
      )}
    </div>
  );
}
