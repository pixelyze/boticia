<template>
  <div>
    <!-- Hero -->
    <HeroSection />

    <!-- Pricing -->
    <PricingSection />

    <!-- Block quote -->
    <BlockQuote
      :quote="t('hero.quote')"
      :author="t('hero.quote_author')"
    />

    <!-- Features -->
    <FeaturesSection />

    <!-- Process -->
    <ProcessSection />

    <!-- FAQ -->
    <FAQSection />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

definePageMeta({
  layout: 'homepage',
});

const { t } = useI18n();

useHead({
  title: t('app.name'),
});
</script>
