"use client";

import { useState } from "react";

import { ImageField } from "@/components/admin/ImageField";
import { Repeatable } from "@/components/admin/Repeatable";
import { SaveBar } from "@/components/admin/SaveBar";
import { TextArea, TextField } from "@/components/admin/fields";
import { setPath, useDoc } from "@/components/admin/useDoc";
import type { Category, GalleryImage, Project, Work } from "@/lib/types";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function WorkForm({ initial }: { initial: Work }) {
  const d = useDoc<Work>("work", initial);
  const v = d.value;
  const [openCat, setOpenCat] = useState<string | null>(v.categories[0]?.slug ?? null);
  const [openProj, setOpenProj] = useState<string | null>(null);
  const setCats = (next: Category[]) => d.setValue(setPath(v, ["categories"], next));

  return (
    <div className="space-y-4">
      <section className="admin-card grid gap-4 sm:grid-cols-2">
        <TextField label="Page title" value={v.title} onChange={(x) => d.setValue(setPath(v, ["title"], x))} />
        <TextField label="Page subtitle" value={v.subtitle} onChange={(x) => d.setValue(setPath(v, ["subtitle"], x))} />
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title mb-4">Categories</h2>
        <Repeatable
          items={v.categories}
          onChange={setCats}
          addLabel="Add category"
          minItems={1}
          makeNew={(): Category => ({
            slug: `category-${Date.now().toString(36)}`,
            title: "New category",
            cardDescription: "",
            description: "",
            illustration: { src: "", width: 900, height: 600 },
            projects: [],
          })}
        >
          {(cat, update) => {
            const open = openCat === cat.slug;
            return (
              <div>
                <button
                  type="button"
                  onClick={() => setOpenCat(open ? null : cat.slug)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span className="font-semibold">
                    {cat.title}{" "}
                    <span className="font-normal text-[var(--a-faint)]">
                      /{cat.slug} &middot; {cat.projects.length} project
                      {cat.projects.length === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="text-[var(--a-faint)]">{open ? "Hide" : "Edit"}</span>
                </button>

                {open && (
                  <div className="mt-4 space-y-5 border-t border-[var(--a-border)] pt-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField label="Title" value={cat.title} onChange={(x) => update({ ...cat, title: x })} />
                      <TextField
                        label="URL slug"
                        value={cat.slug}
                        onChange={(x) => update({ ...cat, slug: slugify(x) })}
                        hint="Address bar: /work/<slug>"
                      />
                    </div>
                    <TextArea
                      label="Short line (Work page card)"
                      value={cat.cardDescription}
                      onChange={(x) => update({ ...cat, cardDescription: x })}
                      rows={2}
                    />
                    <TextArea
                      label="Intro paragraph (top of the category page)"
                      value={cat.description}
                      onChange={(x) => update({ ...cat, description: x })}
                      rows={3}
                    />
                    <ImageField
                      label="Neon illustration"
                      value={{
                        src: cat.illustration.src,
                        width: cat.illustration.width,
                        height: cat.illustration.height,
                      }}
                      onChange={(img) =>
                        update({
                          ...cat,
                          illustration: { src: img.src, width: img.width, height: img.height },
                        })
                      }
                    />

                    <div>
                      <span className="admin-label">Projects</span>
                      <Repeatable
                        items={cat.projects}
                        onChange={(next) => update({ ...cat, projects: next })}
                        addLabel="Add project"
                        makeNew={(): Project => ({
                          slug: `project-${Date.now().toString(36)}`,
                          title: "",
                          image: "",
                          width: 1200,
                          height: 1200,
                          summary: "",
                          description: "",
                          gallery: [],
                        })}
                      >
                        {(proj, updProj) => {
                          const key = `${cat.slug}/${proj.slug}`;
                          const pOpen = openProj === key;
                          const galleryCount = proj.gallery?.length ?? 0;
                          return (
                            <div>
                              <button
                                type="button"
                                onClick={() => setOpenProj(pOpen ? null : key)}
                                className="flex w-full items-center justify-between gap-3 text-left"
                              >
                                <span className="text-sm font-semibold">
                                  {proj.title || "Untitled project"}
                                  {galleryCount > 0 && (
                                    <span className="font-normal text-[var(--a-faint)]">
                                      {" "}
                                      &middot; {galleryCount} extra photo
                                      {galleryCount === 1 ? "" : "s"}
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-[var(--a-faint)]">
                                  {pOpen ? "Hide" : "Edit"}
                                </span>
                              </button>

                              {pOpen && (
                                <div className="mt-3 space-y-3 border-t border-[var(--a-border)] pt-3">
                                  <div className="grid gap-3 sm:grid-cols-2">
                                    <TextField
                                      label="Project name"
                                      value={proj.title}
                                      onChange={(x) =>
                                        updProj({ ...proj, title: x, slug: slugify(x) || proj.slug })
                                      }
                                    />
                                    <TextField
                                      label="URL slug"
                                      value={proj.slug}
                                      onChange={(x) => updProj({ ...proj, slug: slugify(x) })}
                                      hint="/work/<category>/<slug>"
                                    />
                                  </div>
                                  <TextField
                                    label="Summary (one line under the title)"
                                    value={proj.summary ?? ""}
                                    onChange={(x) => updProj({ ...proj, summary: x })}
                                  />
                                  <TextArea
                                    label="Write-up (blank line = new paragraph)"
                                    value={proj.description ?? ""}
                                    onChange={(x) => updProj({ ...proj, description: x })}
                                    rows={5}
                                  />
                                  <div className="grid gap-3 sm:grid-cols-3">
                                    <TextField
                                      label="Client"
                                      value={proj.client ?? ""}
                                      onChange={(x) => updProj({ ...proj, client: x })}
                                    />
                                    <TextField
                                      label="Year"
                                      value={proj.year ?? ""}
                                      onChange={(x) => updProj({ ...proj, year: x })}
                                    />
                                    <TextField
                                      label="Location"
                                      value={proj.location ?? ""}
                                      onChange={(x) => updProj({ ...proj, location: x })}
                                    />
                                  </div>
                                  <ImageField
                                    label="Cover photo"
                                    value={{ src: proj.image, width: proj.width, height: proj.height }}
                                    onChange={(img) =>
                                      updProj({
                                        ...proj,
                                        image: img.src,
                                        width: img.width,
                                        height: img.height,
                                      })
                                    }
                                  />

                                  <div>
                                    <span className="admin-label">Gallery photos</span>
                                    <Repeatable
                                      items={proj.gallery ?? []}
                                      onChange={(g) => updProj({ ...proj, gallery: g })}
                                      addLabel="Add gallery photo"
                                      makeNew={(): GalleryImage => ({
                                        src: "",
                                        width: 1200,
                                        height: 900,
                                        caption: "",
                                      })}
                                    >
                                      {(img, updImg) => (
                                        <div className="space-y-2">
                                          <ImageField
                                            label="Photo"
                                            value={{
                                              src: img.src,
                                              width: img.width,
                                              height: img.height,
                                              alt: img.alt,
                                            }}
                                            withAlt
                                            onChange={(next) =>
                                              updImg({
                                                ...img,
                                                src: next.src,
                                                width: next.width,
                                                height: next.height,
                                                alt: next.alt,
                                              })
                                            }
                                          />
                                          <TextField
                                            label="Caption (optional)"
                                            value={img.caption ?? ""}
                                            onChange={(x) => updImg({ ...img, caption: x })}
                                          />
                                        </div>
                                      )}
                                    </Repeatable>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }}
                      </Repeatable>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        </Repeatable>
      </section>

      <SaveBar {...d.bar} />
    </div>
  );
}
