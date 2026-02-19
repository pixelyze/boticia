<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-20">
        <span class="section-tagline">{{ $t('pricing.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('pricing.title') }}</h2>
      </div>

      <!-- Pricing columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="px-10 py-14 text-center flex flex-col rounded-[2rem] border-2 border-dark/10"
          :class="[
            plan.featured ? 'bg-cream-light' : 'bg-white'
          ]"
        >
          <!-- Badge or spacer for alignment -->
          <span
            v-if="plan.featured"
            class="feature-number"
          >
            {{ $t('pricing.popular') }}
          </span>
          <span v-else class="text-sm">&nbsp;</span>

          <h3 class="plan-name mt-3">{{ plan.name }}</h3>

          <!-- Price -->
          <div class="mt-4 mb-6">
            <span v-if="plan.fromPrice" class="text-dark/50 text-base">{{ $t('pricing.from') }}</span>
            <span class="plan-price block">{{ plan.price }}</span>
          </div>

          <div class="w-8 h-px mx-auto mb-6" :class="plan.featured ? 'bg-terracotta/30' : 'bg-dark/15'"></div>

          <p class="feature-description flex-1">{{ plan.summary }}</p>

          <a
            href="#"
            class="inline-flex items-center gap-3 mx-auto mt-10 px-8 py-3 rounded-full border-2 text-base font-semibold uppercase tracking-[0.15em] transition-all duration-300 group"
            :class="plan.featured
              ? 'text-dark/70 border-dark/30 hover:text-dark hover:border-dark'
              : 'text-dark/60 border-dark/30 hover:text-dark hover:border-dark'"
          >
            {{ $t('pricing.cta') }}
            <span class="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const plans = computed(() => [
  {
    name: t('pricing.plan_2_name'),
    price: t('pricing.plan_2_price'),
    fromPrice: true,
    featured: true,
    summary: t('pricing.plan_2_summary'),
  },
  {
    name: t('pricing.plan_3_name'),
    price: t('pricing.plan_3_price'),
    fromPrice: false,
    featured: false,
    summary: t('pricing.plan_3_summary'),
  },
]);
</script>
