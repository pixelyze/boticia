<template>
  <section class="py-20 md:py-28 bg-cream">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-20">
        <span class="text-sm uppercase tracking-[0.3em] text-dark/60">{{ $t('process.tagline') }}</span>
        <h2 class="section-title-lg text-dark">{{ $t('process.title') }}</h2>
      </div>

      <!-- Steps -->
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="text-center"
        >
          <span class="font-heading text-5xl md:text-6xl text-terracotta/20">{{ index + 1 }}</span>
          <h3 class="font-heading text-xl md:text-2xl text-dark mt-4">{{ step.title }}</h3>
          <p class="text-dark/50 text-sm leading-relaxed mt-4 max-w-xs mx-auto">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const steps = computed(() => [
  {
    title: t('process.step_1_title'),
    description: t('process.step_1_description'),
  },
  {
    title: t('process.step_2_title'),
    description: t('process.step_2_description'),
  },
  {
    title: t('process.step_3_title'),
    description: t('process.step_3_description'),
  },
]);
</script>
