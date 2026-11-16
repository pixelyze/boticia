// Palettes of the "gravure et encre" design (editorial homepage).
// Each palette is a set of colours designed to work together: ink (text,
// frame, details), ground, circle behind the engraving, tint of the flower
// inside the circle, accent (italic taglines). Exposed as CSS variables
// (--ed-*) read by the `ed-*` Tailwind colours.

export interface EditorialPalette {
  key: string;
  name: string;
  ground: string;
  ink: string;
  circle: string;
  tint: string;
  accent: string;
}

export const EDITORIAL_PALETTES: EditorialPalette[] = [
  { key: "terracotta", name: "Terracotta", ground: "#FBF5EE", ink: "#A8431A", circle: "#F7D9C2", tint: "#E8692E", accent: "#5E6B45" },
  { key: "bleu", name: "Bleu outremer", ground: "#FCF4F3", ink: "#2430C8", circle: "#F8DCE3", tint: "#E8284F", accent: "#C2234A" },
  { key: "bordeaux", name: "Bordeaux", ground: "#FBF4F1", ink: "#7A1F2B", circle: "#F2D6D3", tint: "#C73A4E", accent: "#B0445A" },
  { key: "sauge", name: "Sauge", ground: "#F7F4EC", ink: "#3D5638", circle: "#F1D8C3", tint: "#E0784A", accent: "#A04F28" },
  { key: "encre", name: "Encre", ground: "#F6F2EC", ink: "#232323", circle: "#F4D3BD", tint: "#E2652B", accent: "#B04A1C" },
];

const DEFAULT_KEY = "terracotta";

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

export const useEditorialPalette = () => {
  const cookie = useCookie("boticia_palette", {
    default: () => DEFAULT_KEY,
    maxAge: 60 * 60 * 24 * 30,
  });

  const palette = computed(
    () =>
      EDITORIAL_PALETTES.find((p) => p.key === cookie.value) ??
      EDITORIAL_PALETTES[0]
  );

  const cssVars = computed(() => ({
    "--ed-ground": hexToRgb(palette.value.ground),
    "--ed-ink": hexToRgb(palette.value.ink),
    "--ed-circle": hexToRgb(palette.value.circle),
    "--ed-tint": hexToRgb(palette.value.tint),
    "--ed-accent": hexToRgb(palette.value.accent),
  }));

  // The switcher is a presentation tool: only on the demo site and in dev.
  const host = useRequestURL().hostname;
  const canSwitch =
    import.meta.dev || host.startsWith("demo.") || host === "localhost";

  const setPalette = (key: string) => {
    cookie.value = key;
  };

  return {
    palette,
    palettes: EDITORIAL_PALETTES,
    cssVars,
    canSwitch,
    setPalette,
  };
};
