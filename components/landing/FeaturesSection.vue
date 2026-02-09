<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-20">
        <span class="text-sm uppercase tracking-[0.3em] text-dark/60">{{ $t('features.tagline') }}</span>
        <h2 class="section-title-lg text-dark">{{ $t('features.title') }}</h2>
      </div>

      <!-- Features alternating -->
      <div class="max-w-4xl mx-auto space-y-16 md:space-y-20">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="max-w-xl"
        >
          <span class="text-xs uppercase tracking-[0.2em] text-terracotta block mb-3">0{{ index + 1 }}</span>
          <h3 class="font-heading text-2xl md:text-3xl text-dark leading-snug">{{ feature.title }}</h3>
          <p class="text-dark/50 text-base leading-relaxed mt-4">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const features = computed(() => [
  {
    title: t('features.feature_1_title'),
    description: t('features.feature_1_description'),
  },
  {
    title: t('features.feature_2_title'),
    description: t('features.feature_2_description'),
  },
  {
    title: t('features.feature_3_title'),
    description: t('features.feature_3_description'),
  },
]);
</script>
