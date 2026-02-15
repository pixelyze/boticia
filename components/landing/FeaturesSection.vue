<template>
  <section class="py-20 md:py-28 bg-cream">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-20">
        <span class="section-tagline">{{ $t('features.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('features.title') }}</h2>
      </div>

      <!-- Features alternating -->
      <div class="max-w-4xl mx-auto space-y-16 md:space-y-20">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="max-w-xl"
        >
          <span class="feature-number block mb-3">0{{ index + 1 }}</span>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description mt-4">{{ feature.description }}</p>
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
