<template>
  <div
    class="min-h-screen bg-white selection:bg-fuchsia-300 selection:text-fuchsia-900"
  >
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-dark focus:text-cream focus:rounded-lg focus:text-sm focus:font-semibold"
    >
      {{ $t("nav.skip_to_content") }}
    </a>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Initialize site theme (loads from CMS config and applies CSS variable)
useSiteTheme();

// SEO: inject lang attr, canonical URLs, and hreflang tags for every page
const i18nHead = useLocaleHead({ addSeoAttributes: true });
useHead({
  htmlAttrs: computed(() => i18nHead.value.htmlAttrs),
  link: computed(() => i18nHead.value.link),
  meta: computed(() => i18nHead.value.meta),
});
</script>
