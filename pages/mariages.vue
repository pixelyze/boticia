<template>
  <div>
    <!-- Hero -->
    <WeddingIntroSectionV2 title-tag="h1" />

    <!-- Wedding gallery — bento layout -->
    <BentoGallery
      slug="wedding"
      :tagline="$t('weddings.gallery_tagline')"
      :title="$t('weddings.gallery_title')"
      :alt-text="$t('weddings.gallery_title')"
      :lightbox-title="$t('weddings.gallery_title')"
      bg-class="bg-white"
    />


    <!-- Prestations détaillées (v2 ; v1 : WeddingServicesSection) -->
    <WeddingServicesSectionV2 />

    <!-- Pourquoi nous choisir (v2 ; v1 : WeddingWhySection) -->
    <WeddingWhySectionV2 />

    <!-- Bloc « Décoration florale » (v2, comme sur l'accueil) -->
    <AlaCarteSectionV2 />

    <!-- FAQ mariage -->
    <FaqColumns
      :tagline="$t('weddings.faq_tagline')"
      :title="$t('weddings.faq_title')"
      :items="faqs.map((f) => ({ question: f.q, answer: f.a }))"
    />

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6 text-center">
        <h2 class="section-title-lg mb-4">
          {{ $t("weddings.cta_title") }}
        </h2>
        <p class="para-lead mb-8 max-w-xl mx-auto">
          {{ $t("weddings.cta_desc") }}
        </p>
        <Button variant="cta" :to="localePath('/devis')">
          {{ $t("weddings.cta") }}
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
const route = useRoute();

useSeoMeta({
  ogTitle: `${t("weddings.title")} | Boticia Provence`,
  ogDescription: t("seo.mariages_description"),
  ogUrl: `${config.public.siteUrl}${route.path}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: `${t("weddings.title")} | Boticia Provence`,
  twitterDescription: t("weddings.intro"),
});

useHead({
  title: t("weddings.title") + " | Boticia Provence",
  meta: [{ name: "description", content: t("seo.mariages_description") }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Décoration florale de mariage",
        "description": t("weddings.intro"),
        "provider": {
          "@type": "Florist",
          "name": "Boticia",
          "url": "https://boticia.fr",
        },
        "serviceType": "Wedding Floral Decoration",
        "areaServed": {
          "@type": "State",
          "name": "Provence-Alpes-Côte d'Azur",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Prestations mariage",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bouquet de mariée" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Décoration de cérémonie" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Décoration de réception" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Accessoires floraux" } },
          ],
        },
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": t("weddings.faq_1_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("weddings.faq_1_a"),
            },
          },
          {
            "@type": "Question",
            "name": t("weddings.faq_2_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("weddings.faq_2_a"),
            },
          },
          {
            "@type": "Question",
            "name": t("weddings.faq_3_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("weddings.faq_3_a"),
            },
          },
          {
            "@type": "Question",
            "name": t("weddings.faq_4_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("weddings.faq_4_a"),
            },
          },
        ],
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
            "item": `${config.public.siteUrl}/${locale.value}`,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": t("weddings.title"),
            "item": `${config.public.siteUrl}/${locale.value}/mariages`,
          },
        ],
      }),
    },
  ],
});

const faqs = computed(() => [
  { q: t("weddings.faq_1_q"), a: t("weddings.faq_1_a") },
  { q: t("weddings.faq_2_q"), a: t("weddings.faq_2_a") },
  { q: t("weddings.faq_3_q"), a: t("weddings.faq_3_a") },
  { q: t("weddings.faq_4_q"), a: t("weddings.faq_4_a") },
]);


</script>
