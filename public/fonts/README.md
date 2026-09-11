# Panton (brand typeface)

Source: the client's `panton.zip` (Fontfabric free release), converted from OTF
to WOFF2 for the web.

| File | Original | Mapped weights |
|---|---|---|
| `panton-light.woff2` | Panton-LightCaps.otf | 300–500 (normal) |
| `panton-light-italic.woff2` | Panton-LightitalicCaps.otf | 300–500 (italic) |
| `panton-black.woff2` | Panton-BlackCaps.otf | 600–900 (normal) |
| `panton-black-italic.woff2` | Panton-BlackitalicCaps.otf | 600–900 (italic) |

Wired up in `app/layout.tsx` via `next/font/local` as `--font-panton`, which
`app/globals.css` uses for `--font-display` (the big all-caps titles).

Body text uses **Montserrat** (`--font-sans`, from Google Fonts) instead. The
free Panton release is "Caps" only: its lowercase glyphs are drawn as small
capitals — `a` and `A` share one outline — so running text set in it comes out
shouting. Montserrat carries real lowercase and is the face the brand artwork
itself pairs with Panton (see `%%DocumentFonts` in the deck's EPS files).

## Licence

Fontfabric Free Font EULA v2.0 (`PANTON-LICENSE.pdf`) — permits commercial use
and `@font-face` embedding on websites. Redistributing the font files
themselves is not permitted.

## Note on the weights

These are the free **Caps** cuts, so lowercase letters render as small caps.
The design deck's source artwork additionally references `Panton-SemiBold` and
`Panton-Regular`, which are **not** in the free release — if the client wants
true mixed-case text, those weights need to be licensed from Fontfabric and
dropped in here.
