const DEFAULT_LOGO = "/logo-boticia.png";

const siteLogo = ref(DEFAULT_LOGO);
let initialized = false;
let fetched = false;

export const useSiteLogo = () => {
  if (!initialized) {
    initialized = true;
    const cookie = useCookie("boticia_logo", {
      default: () => DEFAULT_LOGO,
      maxAge: 60 * 60 * 24 * 30,
    });
    siteLogo.value = cookie.value || DEFAULT_LOGO;
  }

  if (!fetched && import.meta.client) {
    fetched = true;
    const cookie = useCookie("boticia_logo");
    $fetch<{ data: { value: { url: string } } }>("/api/cms/config", {
      params: { key: "site_logo" },
    })
      .then((res) => {
        if (res?.data?.value?.url) {
          siteLogo.value = res.data.value.url;
          cookie.value = res.data.value.url;
        }
      })
      .catch(() => {
        // Keep default
      });
  }

  const setLogo = (url: string) => {
    siteLogo.value = url;
    if (import.meta.client) {
      const cookie = useCookie("boticia_logo", {
        maxAge: 60 * 60 * 24 * 30,
      });
      cookie.value = url;
    }
  };

  return {
    logo: siteLogo,
    setLogo,
  };
};
