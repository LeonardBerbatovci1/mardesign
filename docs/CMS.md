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
- **Auth** — one shared password (`ADMIN_PASSWORD`). A successful login gets an
  HMAC-signed cookie (`AUTH_SECRET`) checked by `middleware.ts` on every
  `/admin` request. Session lasts 12 hours. For named users later, widen the
  token payload in `lib/session.ts` and add a lookup in `lib/auth.ts`.
- **Uploads** — `lib/uploads.ts` writes to `CONTENT_DIR/uploads`, served back
  through `/api/media/<name>`. Pixel dimensions are read from the file header on
  upload and stored with the reference.
- Public pages are `export const dynamic = "force-dynamic"` — rendered per
  request on the Node server, so an edit shows on the next page load.

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password for `/admin/login`. Make it long. |
| `AUTH_SECRET` | Signs the session cookie. 32+ random chars. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CONTENT_DIR` | Absolute path to a folder **outside** the app for saved content + uploads. Defaults to `./data` in development. |
