"use client";

import { ImageField } from "@/components/admin/ImageField";
import { Repeatable } from "@/components/admin/Repeatable";
import { SaveBar } from "@/components/admin/SaveBar";
import { TextArea, TextField } from "@/components/admin/fields";
import { setPath, useDoc } from "@/components/admin/useDoc";
import type { About, Milestone } from "@/lib/types";

export function AboutForm({ initial }: { initial: About }) {
  const d = useDoc<About>("about", initial);
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
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Button text" value={v.cta.label} onChange={(x) => set(["cta", "label"], x)} />
          <TextField label="Button link" value={v.cta.href} onChange={(x) => set(["cta", "href"], x)} />
        </div>
        <ImageField label="Building image" value={v.image} withAlt onChange={(x) => set(["image"], x)} />
      </section>

      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Timeline</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Section title" value={v.story.title} onChange={(x) => set(["story", "title"], x)} />
          <TextField label="Section subtitle" value={v.story.subtitle} onChange={(x) => set(["story", "subtitle"], x)} />
        </div>
        <Repeatable
          items={v.story.milestones}
          onChange={(next) => set(["story", "milestones"], next)}
          addLabel="Add milestone"
          minItems={1}
          makeNew={(): Milestone => ({ year: "", title: "", body: "" })}
        >
          {(m, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                <TextField label="Year" value={m.year} onChange={(x) => update({ ...m, year: x })} />
                <TextField label="Title" value={m.title} onChange={(x) => update({ ...m, title: x })} />
              </div>
              <TextArea label="Description" value={m.body} onChange={(x) => update({ ...m, body: x })} rows={2} />
              <ImageField
                label="Photo (optional)"
                value={{ src: m.image ?? "", width: 600, height: 450 }}
                onChange={(img) => update({ ...m, image: img.src || undefined })}
              />
            </div>
          )}
        </Repeatable>
      </section>

      <SaveBar {...d.bar} />
    </div>
  );
}
