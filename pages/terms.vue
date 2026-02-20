<template>
  <div class="container mx-auto px-6 py-16 max-w-3xl">
    <h1 class="page-title">{{ t('terms.title') }}</h1>
    <p class="page-subtitle mb-12">{{ t('terms.subtitle') }}</p>

    <div class="space-y-8">
      <section v-for="n in 5" :key="n">
        <h2 class="section-title">{{ t('terms.article', { n }) }}</h2>
        <p class="body-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
  layout: 'homepage',
  pageTransition: false,
});

useHead({
  title: t('terms.title') + ' - Boticia',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: t('seo.terms_description'),
    },
  ],
});
</script>
