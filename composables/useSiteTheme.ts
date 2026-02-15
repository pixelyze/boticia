export interface ThemeColor {
  key: string;
  name: string;
  hex: string;
  description: string;
}

export const THEME_COLORS: ThemeColor[] = [
  { key: "cream", name: "Crème", hex: "#FAF8F5", description: "Chaud, classique" },
  { key: "sable-rose", name: "Sable rosé", hex: "#F5EDE4", description: "Romantique, mariage" },
  { key: "perle", name: "Perle", hex: "#F0EEF5", description: "Minimal, épuré" },
  { key: "champagne", name: "Champagne", hex: "#F5F0E8", description: "Luxe, chaleureux" },
  { key: "blush", name: "Blush", hex: "#F9F0ED", description: "Féminin, doux" },
  { key: "sauge", name: "Sauge", hex: "#F0F2ED", description: "Nature, botanique" },
];

const DEFAULT_COLOR = THEME_COLORS[0];

const siteTheme = ref<ThemeColor>(DEFAULT_COLOR);
let fetched = false;

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function applyTheme(color: ThemeColor) {
  if (import.meta.client) {
    document.documentElement.style.setProperty("--color-cream", hexToRgb(color.hex));
  }
}

export const useSiteTheme = () => {
  if (!fetched && import.meta.client) {
    fetched = true;
    $fetch<{ data: { value: { key: string } } }>("/api/cms/config", {
      params: { key: "site_theme" },
    })
      .then((res) => {
        if (res?.data?.value?.key) {
          const found = THEME_COLORS.find((c) => c.key === res.data.value.key);
          if (found) {
            siteTheme.value = found;
            applyTheme(found);
          }
        }
      })
      .catch(() => {
        // Keep default
      });
  }

  const setTheme = (color: ThemeColor) => {
    siteTheme.value = color;
    applyTheme(color);
  };

  return {
    theme: siteTheme,
    colors: THEME_COLORS,
    setTheme,
  };
};
