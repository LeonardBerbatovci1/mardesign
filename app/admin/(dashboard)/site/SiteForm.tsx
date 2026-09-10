"use client";

import { Repeatable } from "@/components/admin/Repeatable";
import { SaveBar } from "@/components/admin/SaveBar";
import { TextArea, TextField } from "@/components/admin/fields";
import { setPath, useDoc } from "@/components/admin/useDoc";
import type { NavLink, Site } from "@/lib/types";

const PLATFORMS = ["linkedin", "facebook", "instagram", "whatsapp"] as const;
const newLink = (): NavLink => ({ label: "", href: "/" });

function LinkRow({ link, update }: { link: NavLink; update: (l: NavLink) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField label="Label" value={link.label} onChange={(x) => update({ ...link, label: x })} />
      <TextField label="Link" value={link.href} onChange={(x) => update({ ...link, href: x })} />
    </div>
  );
}

export function SiteForm({ initial }: { initial: Site }) {
  const d = useDoc<Site>("site", initial);
  const v = d.value;
  const set = (path: (string | number)[], val: unknown) => d.setValue(setPath(v, path, val));

  return (
    <div className="space-y-4">
      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Brand</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Wordmark" value={v.wordmark} onChange={(x) => set(["wordmark"], x)} />
          <TextField label="Tagline" value={v.tagline} onChange={(x) => set(["tagline"], x)} />
        </div>
        <TextField
          label="Handwritten line"
          value={v.script}
          onChange={(x) => set(["script"], x)}
          hint="The “we design, we finalise” script text"
        />
      </section>

      <section className="admin-card space-y-6">
        <h2 className="admin-section-title">Menu</h2>
        <div>
          <span className="admin-label">Main menu items</span>
          <Repeatable items={v.primaryNav} onChange={(n) => set(["primaryNav"], n)} addLabel="Add menu item" minItems={1} makeNew={newLink}>
            {(link, update) => <LinkRow link={link} update={update} />}
          </Repeatable>
        </div>
        <div>
          <span className="admin-label">Extra items (shown after the “+”)</span>
          <Repeatable items={v.secondaryNav} onChange={(n) => set(["secondaryNav"], n)} addLabel="Add extra item" makeNew={newLink}>
            {(link, update) => <LinkRow link={link} update={update} />}
          </Repeatable>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="CTA button text" value={v.cta.label} onChange={(x) => set(["cta", "label"], x)} />
          <TextField label="CTA button link" value={v.cta.href} onChange={(x) => set(["cta", "href"], x)} />
        </div>
      </section>

      <section className="admin-card">
        <h2 className="admin-section-title mb-4">Social links</h2>
        <Repeatable
          items={v.social}
          onChange={(n) => set(["social"], n)}
          addLabel="Add social link"
          makeNew={() => ({ platform: "instagram" as const, href: "" })}
        >
          {(s, update) => (
            <div className="grid gap-3 sm:grid-cols-[11rem_1fr]">
              <div>
                <span className="admin-label">Network</span>
                <select
                  className="admin-input"
                  value={s.platform}
                  onChange={(e) => update({ ...s, platform: e.target.value as typeof s.platform })}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <TextField label="URL" value={s.href} onChange={(x) => update({ ...s, href: x })} />
            </div>
          )}
        </Repeatable>
      </section>

      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Contact details (footer &amp; contact page)</h2>
        <div>
          <span className="admin-label">Address lines</span>
          <Repeatable
            items={v.contact.location}
            onChange={(n) => set(["contact", "location"], n)}
            addLabel="Add address line"
            minItems={1}
            makeNew={() => ""}
          >
            {(line, update) => <TextField label="Address line" value={line} onChange={update} />}
          </Repeatable>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" value={v.contact.email} onChange={(x) => set(["contact", "email"], x)} />
          <TextField label="Working hours" value={v.contact.workingHours} onChange={(x) => set(["contact", "workingHours"], x)} />
        </div>
      </section>

      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Search engines (SEO)</h2>
        <p className="-mt-2 text-sm text-[var(--a-muted)]">
          This is the text Google shows for the home page and the words it uses
          to understand the business. Every other page builds its own from the
          content you enter on that page.
        </p>
        <TextField
          label="Website address"
          value={v.url}
          onChange={(x) => set(["url"], x)}
          hint="The live domain, e.g. https://mardesign-ks.com — used for links Google follows and the sitemap"
        />
        <TextField
          label="Home page title (browser tab & Google result)"
          value={v.seo.title}
          onChange={(x) => set(["seo", "title"], x)}
          hint="Keep it under ~60 characters and lead with what you do + the city"
        />
        <TextArea
          label="Home page description (the grey text under a Google result)"
          value={v.seo.description}
          onChange={(x) => set(["seo", "description"], x)}
          rows={3}
          hint="~150 characters. Say what you make, for whom, and where."
        />
        <div>
          <span className="admin-label">Keywords / topics</span>
          <Repeatable
            items={v.seo.keywords}
            onChange={(n) => set(["seo", "keywords"], n)}
            addLabel="Add keyword"
            makeNew={() => ""}
          >
            {(kw, update) => <TextField label="Keyword" value={kw} onChange={update} />}
          </Repeatable>
        </div>
      </section>

      <section className="admin-card space-y-5">
        <h2 className="admin-section-title">Business details (for Google Maps & local search)</h2>
        <p className="-mt-2 text-sm text-[var(--a-muted)]">
          Google reads these to place the business on the map and in local
          results. Fill them in as precisely as you can.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Legal / registered name" value={v.business.legalName} onChange={(x) => set(["business", "legalName"], x)} />
          <TextField label="Public phone number" value={v.business.phone} onChange={(x) => set(["business", "phone"], x)} hint="+383 …" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Founded (year)" value={v.business.foundingYear} onChange={(x) => set(["business", "foundingYear"], x)} />
          <TextField label="Price range" value={v.business.priceRange} onChange={(x) => set(["business", "priceRange"], x)} hint="$, $$, $$$" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Street address" value={v.business.streetAddress} onChange={(x) => set(["business", "streetAddress"], x)} />
          <TextField label="City" value={v.business.addressLocality} onChange={(x) => set(["business", "addressLocality"], x)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Region" value={v.business.addressRegion} onChange={(x) => set(["business", "addressRegion"], x)} />
          <TextField label="Postal code" value={v.business.postalCode} onChange={(x) => set(["business", "postalCode"], x)} />
          <TextField label="Country code" value={v.business.addressCountry} onChange={(x) => set(["business", "addressCountry"], x)} hint="XK = Kosovo" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Latitude"
            value={String(v.business.latitude)}
            onChange={(x) => set(["business", "latitude"], Number(x) || 0)}
            hint="From Google Maps: right-click the exact spot → copy the first number"
          />
          <TextField
            label="Longitude"
            value={String(v.business.longitude)}
            onChange={(x) => set(["business", "longitude"], Number(x) || 0)}
            hint="…the second number"
          />
        </div>
        <div>
          <span className="admin-label">Places served</span>
          <Repeatable
            items={v.business.areaServed}
            onChange={(n) => set(["business", "areaServed"], n)}
            addLabel="Add place"
            makeNew={() => ""}
          >
            {(place, update) => <TextField label="Place" value={place} onChange={update} />}
          </Repeatable>
        </div>
      </section>

      <SaveBar {...d.bar} />
    </div>
  );
}
