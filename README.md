# Mardesign — Digital Print

Marketing site for Mardesign, built from the design deck (`PDF FILE.pdf`, 9 artboards).

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Public pages
render on demand so dashboard edits appear immediately.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

## First-time setup

The dashboard needs two secrets. They are **not** in git — create them once.

**Local development:** create a file named `.env.local` in the project root:

```
ADMIN_PASSWORD=pick-any-password-for-local
AUTH_SECRET=paste-a-random-string-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then `npm run dev` and open http://localhost:3000/admin — log in with the
`ADMIN_PASSWORD` you chose. Restart the dev server after editing `.env.local`.

**Production (Hostinger):** set the same variables in the hosting panel, plus
`CONTENT_DIR` — see [docs/DEPLOY-HOSTINGER.md](docs/DEPLOY-HOSTINGER.md).

## Routes

| Route                  | Deck page | Contents                                              |
| ---------------------- | --------- | ----------------------------------------------------- |
| `/`                    | 1         | Hero, product shot, award badges, socials              |
| `/work`                | 2         | The five category cards                                |
| `/work/[slug]`         | 3–7       | Category intro, neon illustration, project gallery     |
| `/work/[slug]/[project]`| —        | Individual project: cover, write-up, facts, gallery    |
| `/about`               | 8         | Story, facility render, 2014→2026 timeline             |
| `/contact`             | 9         | Location / email / hours, two contact cards            |
| `/admin`               | —         | Content dashboard (password-protected)                 |

Category slugs: `totems`, `3d-sign`, `displays`, `vehicle-wraps`, `interior-design`.

## Content model & the dashboard

Every page renders from the getters in [lib/content.ts](lib/content.ts), typed
by [lib/types.ts](lib/types.ts). Content is stored as JSON documents by
[lib/store.ts](lib/store.ts) in a folder set by `CONTENT_DIR` (outside the app,
so redeploys never wipe it); the defaults in [/content](content) seed a fresh
install.

A logged-in admin at **/admin** edits all text, images, colours, menus and
contact details, with add / delete / reorder for categories, projects and
timeline milestones. Saves are live immediately.

- **[docs/SEO.md](docs/SEO.md)** — SEO built in, and the client action list (Search Console, Business Profile)
- **[docs/CMS.md](docs/CMS.md)** — what's editable, how the pieces fit, env vars
- **[docs/DEPLOY-HOSTINGER.md](docs/DEPLOY-HOSTINGER.md)** — deploying to your
  Hostinger Business plan (Node.js app + `CONTENT_DIR` + env vars)

Moving to a database later is contained to `readDoc`/`writeDoc` in
`lib/store.ts` — no page or component changes.

## Design system

Sampled from the deck. These are the **default** values — the client can change
all seven in the dashboard under Colours. Defined in
[app/globals.css](app/globals.css) and overridden at runtime from the saved theme:

| Token            | Value     | Used for                          |
| ---------------- | --------- | --------------------------------- |
| `--color-ink`    | `#154553` | page ground (deep teal)           |
| `--color-ink-deep` | `#103641` | footer, recessed areas          |
| `--color-panel`  | `#1b4755` | cards, nav pill                   |
| `--color-accent` | `#42aa9f` | buttons, script text, active nav  |
| `--color-accent-soft` | `#a7d9d8` | subheads, muted labels      |
| `--color-neon`   | `#22d3ee` | wireframe glow, hairlines         |

Type: **Nunito** (display headings) · **Outfit** (body/UI) · **Caveat Brush**
(the handwritten "we design, we finalise"). All three are matched against the
deck and loaded through `next/font`.

## Assets

`public/images/` was extracted from the design deck itself, so the neon
wireframes, badges and product shots are the originals rather than
reproductions — including their alpha channels. `public/logo-mark.svg` is the
butterfly mark traced to a real vector path; it renders with `currentColor`, so
the nav paints it white and the hero paints it mint from the same file.

## Notes on the deck

Deliberate departures, all reversible in `content/`:

- **Mobile menu.** The home header collapses to a hamburger + full-screen
  overlay below `lg`; inner pages use the floating pill nav at every width.
- **Nav.** The deck draws the pill nav two ways — `Work / About / Contact` plus a
  `+`, and `Work / Service / People / Diary / Contact`. These are treated as the
  collapsed and expanded states of one control; the `+` toggles between them.
- **Typos fixed:** "Costom" → Custom, "loacl" → local, "present you brand" →
  your brand, "Have a projects in mind" → a project, and **"Vehicle Warps" →
  Vehicle Wraps**.
- **Per-category copy.** The deck repeats the Totems paragraph and the heading
  "Our Totem Projects" on all five category pages. Each category now has its own
  intro and its heading is derived from the category name.
- **Vehicle Wraps has no photos** in the deck, so it ships with empty frames.
