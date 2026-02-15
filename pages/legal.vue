<template>
  <div class="container mx-auto px-6 py-16 max-w-3xl">
    <h1 class="page-title">{{ t('legal.title') }}</h1>
    <p class="page-subtitle mb-12">{{ t('legal.subtitle') }}</p>

    <div class="space-y-8">
      <section v-for="n in 5" :key="n">
        <h2 class="section-title">{{ t('legal.article', { n }) }}</h2>
        <p class="body-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
  layout: 'minimal',
});

useHead({
  title: t('legal.title'),
});
</script>
