<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-sm uppercase tracking-[0.3em] text-gray-500">{{ $t('features.tagline') }}</span>
        <h2 class="section-title-lg text-black">{{ $t('features.title') }}</h2>
      </div>

      <!-- Features grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="text-center p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div class="w-14 h-14 bg-black flex items-center justify-center mx-auto mb-6">
            <IconLucid :name="feature.icon" size="lg" color="white" />
          </div>
          <h3 class="item-title text-black">{{ feature.title }}</h3>
          <p class="text-gray-600 mt-3">{{ feature.description }}</p>
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
    icon: 'Zap',
    title: t('features.feature_1_title'),
    description: t('features.feature_1_description'),
  },
  {
    icon: 'Shield',
    title: t('features.feature_2_title'),
    description: t('features.feature_2_description'),
  },
  {
    icon: 'Target',
    title: t('features.feature_3_title'),
    description: t('features.feature_3_description'),
  },
]);
</script>
