import type { Theme } from "./types";

/** Human labels for the palette, shared by the admin UI. */
export const THEME_FIELDS: {
  key: keyof Theme["colors"];
  label: string;
  hint: string;
}[] = [
  { key: "ink", label: "Page background", hint: "The deep teal behind everything" },
  { key: "inkDeep", label: "Footer background", hint: "Darker teal for the footer" },
  { key: "panel", label: "Cards & nav", hint: "Fill of cards and the nav pill" },
  { key: "accent", label: "Accent", hint: "Buttons, links, handwritten text" },
  { key: "accentSoft", label: "Soft accent", hint: "Subheadings and muted labels" },
  { key: "neon", label: "Neon", hint: "Glow and hairline details" },
  { key: "hairline", label: "Borders", hint: "Card and divider outlines" },
];

/**
 * Turn the stored palette into the CSS custom properties the stylesheet reads.
 * Rendered inline on <html> so an admin colour change shows up immediately.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const c = theme.colors;
  return {
    "--color-ink": c.ink,
    "--color-ink-deep": c.inkDeep,
    "--color-panel": c.panel,
    "--color-accent": c.accent,
    "--color-accent-soft": c.accentSoft,
    "--color-neon": c.neon,
    "--color-hairline": c.hairline,
  };
}
