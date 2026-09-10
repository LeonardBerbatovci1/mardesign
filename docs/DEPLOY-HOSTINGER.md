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

hPanel → your Node app → **Environment Variables**:

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | a long passphrase for the client |
| `AUTH_SECRET` | 32+ random characters (`openssl rand -hex 32`) |
| `CONTENT_DIR` | `/home/uXXXXXXXX/mardesign-data` — the folder from step 2, absolute path (check `pwd` in SSH) |
| `NODE_ENV` | `production` |

Redeploy after setting these.

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
