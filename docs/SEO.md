# SEO

The site is built for search from the ground up. This covers what's already in
place and the handful of things only the client can do.

## What's built in

**Per-page metadata** — every page has its own `<title>`, meta description,
and canonical URL, generated from the content in the dashboard:

| Page | Title | Description source |
| --- | --- | --- |
| Home | Site → *Home page title* | Site → *Home page description* |
| `/work` | "Our work — Mardesign" | the category names + subtitle |
| `/work/<category>` | "<Category> — Mardesign" | the category's intro paragraph + city |
| `/work/<category>/<project>` | "<Project> — <Category> — Mardesign" | the project summary / first paragraph |
| `/about` | "<About title> — Mardesign" | the About paragraph |
| `/contact` | "Contact — Mardesign" | the contact paragraph + phone + email |

**Structured data (schema.org JSON-LD)** — helps Google show rich results and
place the business on the map:

- `Organization` + `LocalBusiness` + `ProfessionalService` on every page —
  name, logo, address, geo-coordinates, phone, email, opening hours, founding
  year, price range, areas served, social profiles.
- `WebSite` on every page.
- `BreadcrumbList` on every inner page.
- `Service` on the Work index and each category page.
- `CreativeWork` (case study) on each project page.

All of it is driven by the dashboard: **Header, footer & links → Business
details** and **→ Search engines (SEO)**.

**`sitemap.xml`** — lists the home page, Work, About, Contact, every category
and every project, regenerated whenever content changes. Served at
`/sitemap.xml`.

**`robots.txt`** — allows everything except `/admin` and `/api`, and points
crawlers at the sitemap. Served at `/robots.txt`.

**Social sharing** — Open Graph + Twitter Card tags on every page, with a
branded 1200×630 share image (`/og.png`); project and category pages use their
own photo as the share image.

**Performance** — all public pages are pre-rendered static HTML (fast first
paint, good Core Web Vitals), refreshed the moment content is saved and hourly
as a fallback. Fonts use `display: swap`; images go through `next/image` with
width/height set, so there's no layout shift; the analytics script (if enabled)
loads after the page is interactive.

**Other** — one `<h1>` per page, descriptive `alt` text on images, a web app
manifest, an SVG favicon + Apple touch icon, `lang="en"`, a skip-to-content
link.

## What the client needs to do

These are outside the code and are what actually moves rankings:

### 1. Point the site at the real domain
In the dashboard, **Header, footer & links → Search engines → Website address**,
set the live URL (e.g. `https://mardesign-ks.com`). Everything — canonical URLs,
sitemap, structured data — follows from this.
(Or set `NEXT_PUBLIC_SITE_URL` in the server environment before building; env
wins over the dashboard value.)

### 2. Google Search Console (essential)
1. Go to [search.google.com/search-console](https://search.google.com/search-console) and add the domain.
2. Verify — the easiest way is the DNS TXT record Hostinger lets you add, or
   paste the HTML-tag token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and
   redeploy.
3. Submit `https://<domain>/sitemap.xml` under **Sitemaps**.
4. Check **Pages** and **Enhancements** after a week for crawl or schema errors.

### 3. Google Business Profile (essential for local search)
Create/claim the profile at [business.google.com](https://business.google.com):
- Exact same name, address, phone as in the dashboard **Business details**.
- Category: "Sign shop" / "Commercial printer" / "Digital printing service".
- Add photos of real work, opening hours, service area (Kosovo + Balkans).
- This is the single biggest lever for "signage Prishtina"-type searches.

### 4. Fill in the business details precisely
Dashboard → **Business details**: real street address, and the exact
latitude/longitude (right-click the spot in Google Maps → the two numbers).
The current values are approximate for the Veternik area.

### 5. Fill in the project write-ups
Each project page is a case study. A project with a real summary, a few
paragraphs, the client name and a small gallery ranks for
"<brand> <service>"-type searches and builds the site's authority. Empty
projects (just a photo) do very little.

### 6. Analytics (optional but recommended)
Set `NEXT_PUBLIC_GA_ID` to a GA4 measurement ID (`G-XXXXXXX`) and redeploy;
the script only loads when that variable is present.

### 7. Off-site (ongoing)
- Get listed in Kosovo business directories with a consistent name/address/phone.
- Ask happy clients (the brands in the project gallery) for a link or a mention.
- Keep adding projects — fresh, specific case studies are what compound over time.
