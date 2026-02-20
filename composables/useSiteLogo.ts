const DEFAULT_LOGO = "/logo-boticia.png";

const siteLogo = ref(DEFAULT_LOGO);
let fetched = false;

/**
 * Sanitize logo URL: convert absolute Supabase URLs to relative proxy URLs.
 * This ensures the logo works from any network (localhost, LAN, production).
 */
function sanitizeLogoUrl(url: string): string {
  if (!url) return DEFAULT_LOGO;
  // Convert absolute Supabase storage URLs to relative proxy path
  const match = url.match(/\/storage\/v1(\/object\/public\/.+)$/);
  if (match) {
    return `/api/storage${match[1]}`;
  }
  return url;
}

export const useSiteLogo = () => {
  const cookie = useCookie("boticia_logo", {
    default: () => DEFAULT_LOGO,
    maxAge: 60 * 60 * 24 * 30,
  });

  if (cookie.value && cookie.value !== siteLogo.value) {
    siteLogo.value = sanitizeLogoUrl(cookie.value);
  }

  if (!fetched && import.meta.client) {
    fetched = true;
    $fetch<{ data: { value: { url: string } } }>("/api/cms/config", {
      params: { key: "site_logo" },
    })
      .then((res) => {
        if (res?.data?.value?.url) {
          const url = sanitizeLogoUrl(res.data.value.url);
          siteLogo.value = url;
          cookie.value = url;
        }
      })
      .catch(() => {
        // Keep default
      });
  }

  const setLogo = (url: string) => {
    const safe = sanitizeLogoUrl(url);
    siteLogo.value = safe;
    cookie.value = safe;
  };

  return {
    logo: siteLogo,
    setLogo,
  };
};
