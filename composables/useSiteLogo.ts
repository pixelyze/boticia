const DEFAULT_LOGO = "/logo-boticia.png";

const siteLogo = ref(DEFAULT_LOGO);
let fetched = false;

export const useSiteLogo = () => {
  const cookie = useCookie("boticia_logo", {
    default: () => DEFAULT_LOGO,
    maxAge: 60 * 60 * 24 * 30,
  });

  if (cookie.value && cookie.value !== siteLogo.value) {
    siteLogo.value = cookie.value;
  }

  if (!fetched && import.meta.client) {
    fetched = true;
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
    cookie.value = url;
  };

  return {
    logo: siteLogo,
    setLogo,
  };
};
