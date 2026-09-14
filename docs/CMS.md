# The dashboard (CMS)

A logged-in admin at **`/admin`** can edit every piece of text, every image, the
colour palette, the menus and the contact details — no code, no redeploy. Saves
appear on the live site immediately.

## What can be edited

| Section (`/admin/…`) | Controls |
| --- | --- |
| **Home page** | Eyebrow, headline (white + mint parts), paragraph, button text/link, main product image, award badges (add / remove) |
| **Work & projects** | Page title/subtitle. Each category: title, URL slug, card line, intro, neon illustration. Each project (its own page at `/work/<category>/<project>`): name, slug, summary, write-up, client / year / location, cover photo, and a captioned gallery. Add / delete / reorder categories and projects. |
| **About page** | Title, subtitle, paragraph, button, building image. Timeline milestones — year, title, text, optional photo. Add / delete / reorder. |
| **Contact page** | Intro text, and the contact people (name, role, phone, availability, photo). Add / delete / reorder. |
| **Header, footer & links** | Wordmark, tagline, handwritten line, main menu, the extra "+" menu items, the CTA button, social links, address lines, email, opening hours. |
| **Colours** | The seven palette colours, with a live preview. Applies site-wide. |
| **Media library** | Every uploaded image. Upload or delete. |
| **Dashboard users** | Who can sign in. Add a named account (name, email, password) instead of sharing one login; edit or remove them. |

Every editor has **Save changes**, **Undo edits** (revert unsaved work) and
**Restore original** (roll that section back to the content shipped with the
site).

## How it works

```
content/*.json      lib/store.ts         lib/content.ts        pages
(defaults, in repo) - read/write JSON - getSite() / getWork() - render
                     in CONTENT_DIR      (+ save... writers)
                          ^
                     admin forms  --  server actions  --  zod validation
```

- **`lib/store.ts`** is the only module that knows content is stored as files.
  Documents live in **`CONTENT_DIR`**, *outside* the app, so a redeploy never
  wipes the client's edits. If a document has never been saved, the defaults
  checked into `/content` are served — a fresh install comes up fully populated.
- **`lib/content.ts`** exposes `getSite()`, `getWork()`, ... (reads) and
  `saveSite()`, `saveWork()`, ... (writes). Pages call only the readers. Nothing
  in the components changes if storage moves to a database — reimplement
  `readDoc` / `writeDoc` in `store.ts` and you're done.
- **`lib/admin-actions.ts`** — the server actions the dashboard calls. Every
  write is validated against a zod schema in **`lib/schemas.ts`** before it
  touches disk, then `revalidatePath("/", "layout")` refreshes the public pages.
- **Auth** — two ways in, checked in order (`lib/auth.ts`):
  1. The **owner account** — `ADMIN_EMAIL` / `ADMIN_PASSWORD` in the
     environment. Never stored on disk, always works. This is the recovery
     login if the users list below is ever empty or the wrong people are
     in it.
  2. **Named users**, managed from **Dashboard users** (`lib/users.ts`),
     stored at `CONTENT_DIR/users.json` with salted, hashed passwords
     (`node:crypto.scrypt` — never plaintext).

  A successful login gets an HMAC-signed cookie (`AUTH_SECRET`) carrying the
  signed-in email, checked by `middleware.ts` on every `/admin` request.
  Session lasts 12 hours.
- **Uploads** — `lib/uploads.ts` writes to `CONTENT_DIR/uploads`, served back
  through `/api/media/<name>`. Pixel dimensions are read from the file header on
  upload and stored with the reference.
- Public pages are statically rendered with `export const revalidate = 3600` —
  fast static HTML, regenerated the moment content is saved (`revalidatePath`)
  and hourly as a fallback.

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
| --- | --- |
| `ADMIN_EMAIL` | Owner login email — the recovery account, works even if Dashboard users is empty. |
| `ADMIN_PASSWORD` | Owner login password. Make it long. |
| `AUTH_SECRET` | Signs the session cookie. 32+ random chars. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CONTENT_DIR` | Absolute path to a folder **outside** the app for saved content + uploads. Defaults to `./data` in development. |
