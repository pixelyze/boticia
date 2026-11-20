<template>
  <div>
    <!-- Hero -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
                 md:grid-cols-[2fr_3fr] md:gap-20"
        >
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("faq.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("faq.title") }}
            </h1>
            <p class="para-lead mt-6">
              {{ $t("faq.subtitle") }}
            </p>
            <Button
              variant="cta"
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
      <div class="container mx-auto px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
                 md:grid-cols-[2fr_3fr] md:gap-20"
        >
          <div>
            <span class="section-tagline">
              {{ $t("faq.more_tagline") }}
            </span>
            <h2 class="section-title-lg">
              {{ $t("faq.more_title") }}
            </h2>
          </div>
          <FAQ :items="restFaqItems" />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6 text-center">
        <h2 class="section-title-lg mb-4">
          {{ $t("faq.cta_title") }}
        </h2>
        <p class="para-lead mb-8 max-w-xl mx-auto">
          {{ $t("faq.cta_desc") }}
        </p>
        <Button variant="cta" :to="localePath('/devis')">
          {{ $t("faq.cta_button") }}
        </Button>
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
