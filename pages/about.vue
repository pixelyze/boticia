<template>
  <div class="container mx-auto px-6 py-16 max-w-3xl">
    <!-- Tagline -->
    <p class="section-tagline text-center">{{ t('about.tagline') }}</p>

    <!-- Title -->
    <h1 class="page-title text-center mt-4">{{ t('about.title') }}</h1>

    <!-- Content -->
    <div class="mt-12 space-y-8">
      <p class="text-dark/70 text-lg leading-relaxed">
        {{ t('about.intro') }}
      </p>

      <div class="space-y-4">
        <h2 class="font-heading text-2xl text-dark">{{ t('about.values_title') }}</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 text-dark/70 text-lg leading-relaxed">
            <span class="text-terracotta mt-1 shrink-0">&#9830;</span>
            <span>{{ t('about.value_1') }}</span>
          </li>
          <li class="flex items-start gap-3 text-dark/70 text-lg leading-relaxed">
            <span class="text-terracotta mt-1 shrink-0">&#9830;</span>
            <span>{{ t('about.value_2') }}</span>
          </li>
          <li class="flex items-start gap-3 text-dark/70 text-lg leading-relaxed">
            <span class="text-terracotta mt-1 shrink-0">&#9830;</span>
            <span>{{ t('about.value_3') }}</span>
          </li>
        </ul>
      </div>

      <p class="text-dark/70 text-lg leading-relaxed">
        {{ t('about.approach') }}
      </p>

      <!-- Anecdote -->
      <div class="bg-cream rounded-[2rem] border-2 border-dark/10 px-8 py-8">
        <p class="font-heading text-lg text-dark mb-2">{{ t('about.anecdote_title') }}</p>
        <p class="text-dark/70 text-base leading-relaxed italic">
          {{ t('about.anecdote') }}
        </p>
      </div>

      <!-- CTA -->
      <div class="text-center pt-4">
        <p class="text-dark/70 text-lg mb-6">{{ t('about.cta_text') }}</p>
        <Button variant="primary" :to="localePath('/')">
          {{ t('hero.cta_secondary') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

definePageMeta({
  layout: 'homepage',
  pageTransition: false,
});

const config = useRuntimeConfig();
const route = useRoute();

useSeoMeta({
  ogTitle: t('about.title') + ' | Boticia',
  ogDescription: t('seo.about_description'),
  ogUrl: `${config.public.siteUrl}${route.path}`,
  ogType: 'website',
  twitterTitle: t('about.title') + ' | Boticia',
  twitterDescription: t('seo.about_description'),
});

useHead({
  title: t('about.title') + ' - Boticia',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: t('seo.about_description'),
    },
  ],
});
</script>
