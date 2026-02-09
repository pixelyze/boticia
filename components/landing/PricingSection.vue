<template>
  <section class="py-20 md:py-28 bg-gray-50">
    <div class="container mx-auto px-6">
      <!-- Section header -->
      <div class="text-center mb-16">
        <span class="text-sm uppercase tracking-[0.3em] text-gray-500">{{ $t('pricing.tagline') }}</span>
        <h2 class="section-title-lg text-black">{{ $t('pricing.title') }}</h2>
      </div>

      <!-- Pricing cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="bg-white border-2 p-8 flex flex-col"
          :class="plan.featured
            ? 'border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative'
            : 'border-gray-300'"
        >
          <!-- Featured badge -->
          <div v-if="plan.featured" class="absolute -top-4 left-1/2 -translate-x-1/2">
            <span class="bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-1">
              {{ $t('pricing.popular') }}
            </span>
          </div>

          <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
          <p class="text-gray-600 text-sm mb-6">{{ plan.description }}</p>

          <div class="mb-6">
            <span class="text-4xl font-bold">{{ plan.price }}</span>
            <span class="text-gray-500 ml-1">{{ plan.period }}</span>
          </div>

          <ul class="space-y-3 mb-8 flex-1">
            <li v-for="(feature, i) in plan.features" :key="i" class="flex items-center gap-2 text-sm">
              <IconLucid name="Check" size="sm" class="text-green-600 flex-shrink-0" />
              {{ feature }}
            </li>
          </ul>

          <Button
            :variant="plan.featured ? 'primary' : 'default'"
            class="w-full"
          >
            {{ $t('pricing.cta') }}
          </Button>
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
    period: t('pricing.plan_1_period'),
    featured: false,
    features: [
      t('pricing.plan_1_feature_1'),
      t('pricing.plan_1_feature_2'),
      t('pricing.plan_1_feature_3'),
    ],
  },
  {
    name: t('pricing.plan_2_name'),
    description: t('pricing.plan_2_description'),
    price: t('pricing.plan_2_price'),
    period: t('pricing.plan_2_period'),
    featured: true,
    features: [
      t('pricing.plan_2_feature_1'),
      t('pricing.plan_2_feature_2'),
      t('pricing.plan_2_feature_3'),
      t('pricing.plan_2_feature_4'),
    ],
  },
  {
    name: t('pricing.plan_3_name'),
    description: t('pricing.plan_3_description'),
    price: t('pricing.plan_3_price'),
    period: t('pricing.plan_3_period'),
    featured: false,
    features: [
      t('pricing.plan_3_feature_1'),
      t('pricing.plan_3_feature_2'),
      t('pricing.plan_3_feature_3'),
      t('pricing.plan_3_feature_4'),
      t('pricing.plan_3_feature_5'),
    ],
  },
]);
</script>
