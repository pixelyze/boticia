<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-sm uppercase tracking-[0.3em] text-gray-500">{{ $t('faq.tagline') }}</span>
        <h2 class="section-title-lg text-black">{{ $t('faq.title') }}</h2>
      </div>

      <!-- FAQ -->
      <div class="max-w-2xl mx-auto">
        <FAQ :items="faqItems" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const faqItems = computed(() => [
  { question: t('faq.q1'), answer: t('faq.a1') },
  { question: t('faq.q2'), answer: t('faq.a2') },
  { question: t('faq.q3'), answer: t('faq.a3') },
  { question: t('faq.q4'), answer: t('faq.a4') },
]);
</script>
