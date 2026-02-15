<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-20">
        <span class="section-tagline">{{ $t('pricing.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('pricing.title') }}</h2>
      </div>

      <!-- Pricing columns -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="px-10 py-14 text-center flex flex-col"
          :class="[
            plan.featured ? 'bg-cream' : ''
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
          <p class="plan-description mt-2 mb-4">{{ plan.description }}</p>

          <!-- Price -->
          <div class="mb-8">
            <span v-if="plan.fromPrice" class="text-dark/60 text-sm">{{ $t('pricing.from') }}</span>
            <span class="plan-price block">{{ plan.price }}</span>
          </div>

          <div class="w-8 h-px mx-auto mb-8" :class="plan.featured ? 'bg-terracotta/30' : 'bg-dark/15'"></div>

          <ul class="space-y-4 text-base text-dark/70 text-left max-w-[220px] mx-auto flex-1">
            <li v-for="(feature, i) in plan.features" :key="i">
              {{ feature }}
            </li>
          </ul>

          <a
            href="#"
            class="flex items-center justify-between w-full max-w-[220px] mx-auto mt-10 text-base border-b pb-0.5 transition-all duration-300 group"
            :class="plan.featured
              ? 'text-dark border-dark hover:border-dark/50'
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
    name: t('pricing.plan_1_name'),
    description: t('pricing.plan_1_description'),
    price: t('pricing.plan_1_price'),
    fromPrice: true,
    featured: false,
    features: [
      t('pricing.plan_1_feature_1'),
      t('pricing.plan_1_feature_2'),
      t('pricing.plan_1_feature_3'),
      t('pricing.plan_1_feature_4'),
    ],
  },
  {
    name: t('pricing.plan_2_name'),
    description: t('pricing.plan_2_description'),
    price: t('pricing.plan_2_price'),
    fromPrice: true,
    featured: true,
    features: [
      t('pricing.plan_2_feature_1'),
      t('pricing.plan_2_feature_2'),
      t('pricing.plan_2_feature_3'),
      t('pricing.plan_2_feature_4'),
      t('pricing.plan_2_feature_5'),
      t('pricing.plan_2_feature_6'),
      t('pricing.plan_2_feature_7'),
    ],
  },
  {
    name: t('pricing.plan_3_name'),
    description: t('pricing.plan_3_description'),
    price: t('pricing.plan_3_price'),
    fromPrice: false,
    featured: false,
    features: [
      t('pricing.plan_3_feature_1'),
      t('pricing.plan_3_feature_2'),
      t('pricing.plan_3_feature_3'),
      t('pricing.plan_3_feature_4'),
      t('pricing.plan_3_feature_5'),
      t('pricing.plan_3_feature_6'),
      t('pricing.plan_3_feature_7'),
      t('pricing.plan_3_feature_8'),
    ],
  },
]);
</script>
