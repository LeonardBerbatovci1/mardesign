# Deploying to Hostinger (Business / Cloud plan)

This app needs the **Node.js** runtime, which Hostinger provides on Business Web
Hosting and all Cloud plans. On Hostinger a Node app is its own "website"
entry — separate from any PHP site on the same account.

## 1. Create the Node.js application

hPanel → **Websites** → **Add Website** → **Import Git Repository** (or upload a
`.zip`). Point it at this repository. Hostinger auto-detects Next.js; confirm:

- **Build command:** `npm run build`
- **Start command:** `npm run start`
- **Node version:** 20 or 22
- **App / output port:** leave as Hostinger sets it (the app reads `PORT`)

The app deploys as a standard Next.js server (`next start`), which is exactly
Hostinger's default start command for a Node.js app.

## 2. Create the content folder (once)

Over SSH (hPanel → Advanced → **SSH Access**):

```bash
mkdir -p ~/mardesign-data/uploads
```

This lives **outside** the deployed app so redeploys never touch it.

## 3. Set environment variables

**hPanel → your Node app → Advanced → Environment Variables** → *Add variable*
for each row. The dashboard login (`/admin`) will show "ADMIN_PASSWORD is not
set" until at least the first two are in place.

| Name | Value | How to get it |
| --- | --- | --- |
| `ADMIN_PASSWORD` | the client's dashboard password | pick a long passphrase, e.g. `lantern-vellum-delta-meadow-1994` |
| `AUTH_SECRET` | a 64-char random string | run `openssl rand -hex 32` in SSH, or `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CONTENT_DIR` | absolute path to the folder from step 2 | run `pwd` inside `~/mardesign-data` over SSH and copy the result, e.g. `/home/u123456/mardesign-data` |
| `NEXT_PUBLIC_SITE_URL` | the live domain, no trailing slash | e.g. `https://mardesign-ks.com` |
| `NODE_ENV` | `production` | literally `production` |

Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console token),
`NEXT_PUBLIC_GA_ID` (Google Analytics `G-XXXXXXX`).

**Click "Save", then redeploy** (or restart the app) — variables are only read
when the app starts.

## 4. Domain

Point the domain (or subdomain) at the Node app in hPanel. If the main domain
currently serves a PHP site, use a subdomain or move the Node app to the primary
domain slot.

## 5. Hand-off to the client

- Dashboard: `https://<domain>/admin`
- Give them the `ADMIN_PASSWORD` only. Keep `AUTH_SECRET` private.

## Redeploying (code changes)

Push to the connected branch (or re-upload the zip) and Hostinger rebuilds.
`CONTENT_DIR` is untouched, so all client edits and uploads survive.

## Backups

Everything the client owns is in `CONTENT_DIR`. To back up:

```bash
tar czf mardesign-backup-$(date +%F).tgz -C ~/mardesign-data .
```

## If the site ever outgrows this

The move to a database is contained: reimplement `readDoc` / `writeDoc` in
`lib/store.ts` against Hostinger's MySQL (already available on your plan) and
move `lib/uploads.ts` to object storage. No pages or components change.
