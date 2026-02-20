export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  router.beforeEach((to) => {
    const locale = to.path.split("/")[1];
    const validLocales = ["fr", "en", "ja"];
    if (validLocales.includes(locale)) {
      const i18n = nuxtApp.$i18n as { locale: { value: string } };
      if (i18n.locale.value !== locale) {
        i18n.locale.value = locale;
      }
    }
  });
});
