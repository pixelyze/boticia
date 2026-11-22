<template>
  <div>
    <!-- Hero -->
    <WeddingIntroSectionV2 title-tag="h1" />

    <!-- Wedding gallery — bento layout -->
    <BentoGallery
      page="wedding"
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

    <!-- Bloc « Décoration florale » retiré (nov. 2026) : il présente aussi
         les entreprises et les ateliers, hors sujet sur cette page. Il
         reste sur l'accueil. -->

    <!-- FAQ mariage -->
    <FaqColumns
      bg-class="bg-cream-light"
      :tagline="$t('weddings.faq_tagline')"
      :title="$t('weddings.faq_title')"
      :items="faqs.map((f) => ({ question: f.q, answer: f.a }))"
    />

    <!-- Où nous intervenons + CTA : une seule section blanche, entre la FAQ
         (crème clair) et le pied de page (crème clair). Les villes viennent
         des volumes SE Ranking (seo/keywords.md) : Aix-en-Provence,
         Marseille, Avignon, puis Lambesc (adresse du studio). -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center max-w-3xl">
        <p class="section-tagline">{{ $t("weddings.zones_tagline") }}</p>
        <!-- « Aix-en-Provence » ne se coupe pas sur ses tirets -->
        <i18n-t
          keypath="weddings.zones_title"
          tag="h2"
          class="section-title-lg mb-6 text-balance"
          scope="global"
        >
          <template #aix>
            <span class="whitespace-nowrap">{{ $t("weddings.zones_aix") }}</span>
          </template>
        </i18n-t>
        <p class="para-lead">{{ $t("weddings.zones_text") }}</p>
        <p class="para mt-6 text-dark">{{ $t("weddings.zones_cities") }}</p>
      </div>

      <div
        class="container mx-auto px-6 text-center mt-16 md:mt-20 pt-16
               md:pt-20 border-t border-dark/20 max-w-3xl"
      >
        <h2 class="section-title-lg mb-4">
          {{ $t("weddings.cta_title") }}
        </h2>
        <p class="para-lead mb-8 max-w-xl mx-auto">
          {{ $t("weddings.cta_desc") }}
        </p>
        <Button variant="cta" :to="localePath('devis')">
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

// Adresses traduites : l'anglais et le japonais ont une adresse en anglais.
// Les anciennes (/en/mariages…) redirigent en 301, voir server/middleware/redirects.ts
defineI18nRoute({
  paths: {
    fr: "/mariages",
    en: "/weddings",
    ja: "/weddings",
  },
});


const { t, locale } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const route = useRoute();

useSeoMeta({
  // Titre SEO distinct du H1 (texte de Laëtitia, inchangé) : il porte le
  // mot-clé principal « décoration florale mariage » (seo/keywords.md)
  ogTitle: `${t("seo.mariages_title")} | Boticia`,
  ogDescription: t("seo.mariages_description"),
  ogUrl: `${config.public.siteUrl}${route.path}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: `${t("seo.mariages_title")} | Boticia`,
  twitterDescription: t("weddings.intro"),
});

useHead({
  title: `${t("seo.mariages_title")} | Boticia`,
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
        "areaServed": [
          { "@type": "State", "name": "Provence-Alpes-Côte d'Azur" },
          { "@type": "City", "name": "Aix-en-Provence" },
          { "@type": "City", "name": "Marseille" },
          { "@type": "City", "name": "Avignon" },
          { "@type": "City", "name": "Lambesc" },
          { "@type": "City", "name": "Paris" },
        ],
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
          {
            "@type": "Question",
            "name": t("weddings.faq_5_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("weddings.faq_5_a"),
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
            "item": `${config.public.siteUrl}${localePath("mariages")}`,
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
  { q: t("weddings.faq_5_q"), a: t("weddings.faq_5_a") },
]);


</script>
