<template>
  <div>
    <!-- Hero -->
    <HeroSection />

    <!-- Pricing -->
    <PricingSection />

    <!-- Intro -->
    <IntroSection />

    <!-- Features -->
    <FeaturesSection />

    <!-- Process -->
    <ProcessSection />

    <!-- Block quote -->
    <BlockQuote
      :quote="$t('hero.quote')"
      :author="$t('hero.quote_author')"
    />

    <!-- FAQ -->
    <FAQSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'homepage',
});

const { t } = useI18n();

useHead({
  title: t('hero.title') + ' — Boticia',
});
</script>
