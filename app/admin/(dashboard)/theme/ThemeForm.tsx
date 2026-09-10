"use client";

import { ColorField } from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/SaveBar";
import { setPath, useDoc } from "@/components/admin/useDoc";
import { THEME_FIELDS } from "@/lib/theme";
import type { Theme } from "@/lib/types";

export function ThemeForm({ initial }: { initial: Theme }) {
  const d = useDoc<Theme>("theme", initial);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <div className="admin-card grid gap-5 sm:grid-cols-2">
        {THEME_FIELDS.map((f) => (
          <ColorField
            key={f.key}
            label={f.label}
            hint={f.hint}
            value={d.value.colors[f.key]}
            onChange={(v) => d.setValue(setPath(d.value, ["colors", f.key], v))}
          />
        ))}
      </div>

      <div
        className="admin-card h-fit lg:sticky lg:top-6"
        style={{ background: d.value.colors.ink, color: "#fff", borderColor: d.value.colors.hairline }}
      >
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: d.value.colors.accentSoft }}>
          Live preview
        </p>
        <p className="mt-2 text-2xl font-extrabold leading-tight">Solutions that stand out</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: d.value.colors.accent, color: "#fff" }}>
            Button
          </span>
          <span
            className="rounded-lg border px-4 py-1.5 text-sm"
            style={{ background: d.value.colors.panel, borderColor: d.value.colors.hairline }}
          >
            Card
          </span>
        </div>
        <p className="mt-3 text-sm" style={{ color: d.value.colors.neon }}>
          we design, we finalise
        </p>
      </div>

      <div className="lg:col-span-2">
        <SaveBar {...d.bar} />
      </div>
    </div>
  );
}

