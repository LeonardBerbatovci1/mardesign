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
`app/globals.css` uses for both `--font-display` and `--font-sans`.

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
