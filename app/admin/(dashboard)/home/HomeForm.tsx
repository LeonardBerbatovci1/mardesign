"use client";

import { ImageField } from "@/components/admin/ImageField";
import { Repeatable } from "@/components/admin/Repeatable";
import { SaveBar } from "@/components/admin/SaveBar";
import { TextArea, TextField } from "@/components/admin/fields";
import { setPath, useDoc } from "@/components/admin/useDoc";
import type { Home, ImageRef } from "@/lib/types";

export function HomeForm({ initial }: { initial: Home }) {
  const d = useDoc<Home>("home", initial);
  const h = d.value.hero;
  const set = (path: (string | number)[], v: unknown) =>
    d.setValue(setPath(d.value, ["hero", ...path], v));

  return (
    <div className="space-y-4">
      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Headline</h2>
        <TextField
          label="Small line above the headline"
          value={h.eyebrow}
          onChange={(v) => set(["eyebrow"], v)}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <TextArea label="Headline — white part" value={h.title} onChange={(v) => set(["title"], v)} rows={2} />
          <TextArea label="Headline — mint part" value={h.titleAccent} onChange={(v) => set(["titleAccent"], v)} rows={2} />
        </div>
        <TextArea label="Paragraph under the headline" value={h.body} onChange={(v) => set(["body"], v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Button text" value={h.cta.label} onChange={(v) => set(["cta", "label"], v)} />
          <TextField label="Button link" value={h.cta.href} onChange={(v) => set(["cta", "href"], v)} hint="e.g. /work or /contact" />
        </div>
      </section>

      <section className="admin-card space-y-4">
        <h2 className="admin-section-title">Main image</h2>
        <ImageField label="Product image" value={h.image} withAlt onChange={(v) => set(["image"], v)} />
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title mb-4">Award badges</h2>
        <Repeatable
          items={h.badges}
          onChange={(next) => set(["badges"], next)}
          addLabel="Add badge"
          makeNew={(): ImageRef => ({ src: "", alt: "", width: 380, height: 380 })}
        >
          {(badge, update) => <ImageField label="Badge image" value={badge} withAlt onChange={update} />}
        </Repeatable>
      </section>

      <SaveBar {...d.bar} />
    </div>
  );
}
