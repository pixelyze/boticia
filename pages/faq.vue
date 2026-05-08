<template>
  <div>
    <!-- Hero -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("faq.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("faq.title") }}
            </h1>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("faq.subtitle") }}
            </p>
            <Button
              variant="primary"
              icon="MoveRight"
              :to="localePath('/devis')"
              class="mt-8"
            >
              {{ $t("faq.cta_button") }}
            </Button>
          </div>
          <!-- First 4 FAQ items -->
          <div>
            <FAQ :items="heroFaqItems" />
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ accordion -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="text-center mb-12">
          <span class="section-tagline">
            {{ $t("faq.more_tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("faq.more_title") }}
          </h2>
        </div>
        <div class="max-w-3xl mx-auto">
          <FAQ :items="restFaqItems" />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="pb-16 md:pb-24 bg-white">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="max-w-3xl mx-auto">
          <div class="rounded-[2rem] bg-cream-light px-8 md:px-12 py-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div class="flex-1 min-w-0 text-center md:text-left">
              <h2 class="font-heading text-xl md:text-2xl text-dark">
                {{ $t("faq.cta_title") }}
              </h2>
              <p class="text-dark/60 mt-2">
                {{ $t("faq.cta_desc") }}
              </p>
            </div>
            <Button variant="primary" icon="MoveRight" :to="localePath('/devis')" class="shrink-0">
              {{ $t("faq.cta_button") }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

definePageMeta({
  layout: "homepage",
  pageTransition: false,
});

const { t, locale } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;

const FAQ_COUNT = 10;

const allFaqItems = computed(() =>
  Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`),
  }))
);

const heroFaqItems = computed(() => allFaqItems.value.slice(0, 4));
const restFaqItems = computed(() => allFaqItems.value.slice(4));

const route = useRoute();

useSeoMeta({
  ogTitle: t("faq.page_title") + " | Boticia",
  ogDescription: t("faq.subtitle"),
  ogUrl: `${siteUrl}${route.path}`,
  ogType: "website",
  twitterTitle: t("faq.page_title") + " | Boticia",
  twitterDescription: t("faq.subtitle"),
});

useHead({
  title: t("faq.page_title") + " - Boticia",
  meta: [{ name: "description", content: t("faq.subtitle") }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": allFaqItems.value.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer,
          },
        })),
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Boticia",
            "item": `${siteUrl}/${locale.value}`,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": t("faq.page_title"),
            "item": `${siteUrl}/${locale.value}/faq`,
          },
        ],
      }),
    },
  ],
});
</script>
