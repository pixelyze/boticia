export interface ThemeColor {
  key: string;
  name: string;
  hex: string;
  description: string;
}

export const THEME_COLORS: ThemeColor[] = [
  { key: "cream", name: "Crème", hex: "#E8E4DD", description: "Chaud, classique" },
  { key: "sable-rose", name: "Sable rosé", hex: "#E4DCD3", description: "Romantique, mariage" },
  { key: "perle", name: "Perle", hex: "#E0DEE5", description: "Minimal, épuré" },
  { key: "champagne", name: "Champagne", hex: "#E5E0D8", description: "Luxe, chaleureux" },
  { key: "blush", name: "Blush", hex: "#EDDAD4", description: "Féminin, doux" },
  { key: "sauge", name: "Sauge", hex: "#E0E2DD", description: "Nature, botanique" },
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

function hexToLightRgb(hex: string): string {
  const r = Math.round((parseInt(hex.slice(1, 3), 16) + 255) / 2);
  const g = Math.round((parseInt(hex.slice(3, 5), 16) + 255) / 2);
  const b = Math.round((parseInt(hex.slice(5, 7), 16) + 255) / 2);
  return `${r} ${g} ${b}`;
}

export const useSiteTheme = () => {
  const cookie = useCookie("boticia_theme", {
    default: () => DEFAULT_COLOR.key,
    maxAge: 60 * 60 * 24 * 30,
  });

  const found = THEME_COLORS.find((c) => c.key === cookie.value);
  if (found && found.key !== siteTheme.value.key) {
    siteTheme.value = found;
  }

  // Inject CSS variable via useHead — works on both SSR and client
  useHead({
    htmlAttrs: {
      style: computed(
        () =>
          `--color-cream: ${hexToRgb(siteTheme.value.hex)}; --color-cream-light: ${hexToLightRgb(siteTheme.value.hex)};`
      ),
    },
  });

  if (!fetched && import.meta.client) {
    fetched = true;
    $fetch<{ data: { value: { key: string } } }>("/api/cms/config", {
      params: { key: "site_theme" },
    })
      .then((res) => {
        if (res?.data?.value?.key) {
          const found = THEME_COLORS.find(
            (c) => c.key === res.data.value.key
          );
          if (found) {
            siteTheme.value = found;
            cookie.value = found.key;
          }
        }
      })
      .catch(() => {
        // Keep default
      });
  }

  const setTheme = (color: ThemeColor) => {
    siteTheme.value = color;
    cookie.value = color.key;
  };

  return {
    theme: siteTheme,
    colors: THEME_COLORS,
    setTheme,
  };
};
