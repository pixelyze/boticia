<template>
  <BentoGallery
    slug="portfolio"
    :tagline="$t('portfolio.tagline')"
    :title="$t('portfolio.title')"
    :alt-text="$t('portfolio.photo_alt')"
    :lightbox-title="$t('portfolio.title')"
    bg-class="bg-cream-light"
  />
</template>

<script setup>
const { t } = useI18n();
</script>
