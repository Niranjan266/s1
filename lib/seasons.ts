// Palettes per season. CSS tokens (--background, --ink-*, --ice-*) are
// redefined in globals.css via [data-season="..."] selectors so every piece
// of UI styled with those variables themes automatically. A few extras
// (keyboardBase, particle colours) are consumed by React components via
// `useSeason()` because they live in canvases or inline SVG where CSS
// variables don't easily reach.
export type SeasonId = "winter" | "spring" | "summer" | "autumn";

export type SeasonPalette = {
  id: SeasonId;
  label: string;
  // Accent colour for the season picker button.
  accent: string;
  // Base plastic colour of the 3D keyboard body.
  keyboardBase: string;
  // Colour of the falling particles in FrozenBackground.
  particle: string;
  // Soft halo colour drawn around larger particles.
  particleHalo: string;
};

export const SEASONS: SeasonPalette[] = [
  {
    id: "spring",
    label: "Primavera",
    accent: "#76c487",
    keyboardBase: "#7bc98c",
    particle: "rgba(228, 255, 220, 0.72)",
    particleHalo: "rgba(184, 230, 168, 0.2)",
  },
  {
    id: "summer",
    label: "Verano",
    accent: "#ff9c2f",
    keyboardBase: "#ffaa42",
    particle: "rgba(255, 240, 180, 0.78)",
    particleHalo: "rgba(255, 180, 90, 0.22)",
  },
  {
    id: "autumn",
    label: "Otoño",
    accent: "#e07230",
    keyboardBase: "#d4682a",
    particle: "rgba(255, 190, 140, 0.7)",
    particleHalo: "rgba(210, 110, 50, 0.25)",
  },
  {
    id: "winter",
    label: "Invierno",
    accent: "#7aa6d0",
    keyboardBase: "#6cadef",
    particle: "rgba(220, 235, 252, 0.75)",
    particleHalo: "rgba(166, 197, 228, 0.18)",
  },
];

export const DEFAULT_SEASON: SeasonId = "winter";

export function getPalette(id: SeasonId): SeasonPalette {
  return SEASONS.find((s) => s.id === id) ?? SEASONS[SEASONS.length - 1];
}
