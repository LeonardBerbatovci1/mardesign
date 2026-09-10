"use client";

import { ImageField } from "@/components/admin/ImageField";
import { Repeatable } from "@/components/admin/Repeatable";
import { SaveBar } from "@/components/admin/SaveBar";
import { TextArea, TextField } from "@/components/admin/fields";
import { setPath, useDoc } from "@/components/admin/useDoc";
import type { Contact, Person } from "@/lib/types";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "person";

export function ContactForm({ initial }: { initial: Contact }) {
  const d = useDoc<Contact>("contact", initial);
  const v = d.value;
  const set = (path: (string | number)[], val: unknown) => d.setValue(setPath(v, path, val));

  return (
    <div className="space-y-4">
      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Intro</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Page title" value={v.title} onChange={(x) => set(["title"], x)} />
          <TextField label="Subtitle" value={v.subtitle} onChange={(x) => set(["subtitle"], x)} />
        </div>
        <TextArea label="Paragraph" value={v.body} onChange={(x) => set(["body"], x)} rows={4} />
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title mb-4">Contact people</h2>
        <Repeatable
          items={v.people}
          onChange={(next) => set(["people"], next)}
          addLabel="Add person"
          makeNew={(): Person => ({
            slug: "", name: "", role: "", phone: "", availability: "",
            image: "", width: 1100, height: 896,
          })}
        >
          {(p, update) => (
            <div className="space-y-3">
              <TextField
                label="Name / job title"
                value={p.name}
                onChange={(x) => update({ ...p, name: x, slug: p.slug || slugify(x) })}
              />
              <TextArea label="Short description" value={p.role} onChange={(x) => update({ ...p, role: x })} rows={2} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Phone" value={p.phone} onChange={(x) => update({ ...p, phone: x })} />
                <TextField
                  label="Availability note"
                  value={p.availability}
                  onChange={(x) => update({ ...p, availability: x })}
                  hint="e.g. Available in office"
                />
              </div>
              <ImageField
                label="Photo"
                value={{ src: p.image, width: p.width, height: p.height }}
                onChange={(img) => update({ ...p, image: img.src, width: img.width, height: img.height })}
              />
            </div>
          )}
        </Repeatable>
      </section>

      <SaveBar {...d.bar} />
    </div>
  );
}
