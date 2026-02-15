const DEFAULT_LOGO = "/logo-boticia.png";

const siteLogo = ref(DEFAULT_LOGO);
let fetched = false;

export const useSiteLogo = () => {
  if (!fetched && import.meta.client) {
    fetched = true;
    $fetch<{ data: { value: { url: string } } }>("/api/cms/config", {
      params: { key: "site_logo" },
    })
      .then((res) => {
        if (res?.data?.value?.url) {
          siteLogo.value = res.data.value.url;
        }
      })
      .catch(() => {
        // Keep default
      });
  }

  const setLogo = (url: string) => {
    siteLogo.value = url;
  };

  return {
    logo: siteLogo,
    setLogo,
  };
};
