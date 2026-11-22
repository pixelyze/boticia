<template>
  <div>
    <!-- Hero + Services -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 gap-12 items-start
                 md:grid-cols-[2fr_3fr] md:gap-20"
        >
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("events.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("events.title") }}
            </h1>
            <p class="para-lead mt-6">
              {{ $t("events.intro") }}
            </p>
            <Button
              variant="cta"
              :to="localePath('devis')"
              class="mt-8"
            >
              {{ $t("events.cta") }}
            </Button>
          </div>
          <!-- Prestations : liste entre filets (comme Mariages) -->
          <ul class="border-t border-dark/20">
            <li
              v-for="(service, i) in services"
              :key="i"
              class="flex items-start gap-5 py-7 border-b border-dark/20"
            >
              <IconPhosphor :name="service.icon" size="md" class="text-dark mt-1" />
              <div>
                <h3 class="item-heading mb-2">
                  {{ service.title }}
                </h3>
                <p class="para">
                  {{ service.desc }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Abonnement floral (textes de Laëtitia, MODIF SITE nov. 2026).
         Ancre #abonnement pour y renvoyer depuis d'autres pages. -->
    <section id="abonnement" class="py-16 md:py-24 bg-white scroll-mt-32">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Images superposées -->
          <div class="relative w-full aspect-square max-w-md mx-auto">
            <div
              class="absolute top-0 left-0 w-[65%] aspect-square
                     overflow-hidden shadow-lg z-10"
            >
              <img
                :src="philosophyImage1.public_url"
                :alt="philosophyImage1.caption || $t('events.philosophy_title')"
                loading="lazy"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="absolute bottom-0 right-0 w-[65%] aspect-square
                     overflow-hidden shadow-lg"
            >
              <img
                :src="philosophyImage2.public_url"
                :alt="philosophyImage2.caption || $t('events.philosophy_title')"
                loading="lazy"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("events.philosophy_tagline") }}
            </span>
            <h2 class="section-title-lg">
              {{ $t("events.philosophy_title") }}
            </h2>
            <p class="para-lead mt-6">
              {{ $t("events.philosophy_p1") }}
            </p>
            <Button variant="cta" :to="localePath('devis')" class="mt-8">
              {{ $t("events.cta") }}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery — bento layout -->
    <BentoGallery
      page="events"
      :tagline="$t('events.gallery_tagline')"
      :title="$t('events.gallery_title')"
      :alt-text="$t('events.gallery_alt')"
      :lightbox-title="$t('events.gallery_title')"
      bg-class="bg-cream-light"
    />

    <!-- Pourquoi nous choisir -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <span class="section-tagline">{{ $t("events.why_tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("events.why_title") }}</h2>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16">
          <article
            v-for="reason in reasons"
            :key="reason.icon"
            class="flex items-start gap-5 py-8 border-t border-dark/20"
          >
            <IconPhosphor :name="reason.icon" size="md" class="text-dark mt-1" />
            <div>
              <h3 class="item-heading mb-2">{{ reason.title }}</h3>
              <p class="para">{{ reason.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ événements -->
    <FaqColumns
      :tagline="$t('events.faq_tagline')"
      :title="$t('events.faq_title')"
      :items="faqs.map((f) => ({ question: f.q, answer: f.a }))"
      bg-class="bg-cream-light"
    />

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="section-title-lg mb-4">
          {{ $t("events.cta_title") }}
        </h2>
        <p class="para-lead mb-8 max-w-xl mx-auto">
          {{ $t("events.cta_desc") }}
        </p>
        <Button variant="cta" :to="localePath('devis')">
          {{ $t("events.cta") }}
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
// Les anciennes (/en/evenements…) redirigent en 301, voir server/middleware/redirects.ts
defineI18nRoute({
  paths: {
    fr: "/evenements",
    en: "/events",
    ja: "/events",
  },
});


const { t, locale } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const route = useRoute();

useSeoMeta({
  ogTitle: `${t("seo.evenements_title")} | Boticia Provence`,
  ogDescription: t("events.intro"),
  ogUrl: `${config.public.siteUrl}${route.path}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: `${t("seo.evenements_title")} | Boticia Provence`,
  twitterDescription: t("events.intro"),
});

useHead({
  title: t("seo.evenements_title") + " | Boticia Provence",
  meta: [{ name: "description", content: t("events.intro") }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Scénographie florale événementielle",
        "description": t("events.intro"),
        "provider": {
          "@type": "Florist",
          "name": "Boticia",
          "url": "https://boticia.fr",
        },
        "serviceType": "Event Floral Design",
        "areaServed": {
          "@type": "State",
          "name": "Provence-Alpes-Côte d'Azur",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Prestations événementielles",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Scénographie florale" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Décor corporate" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corner floral" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shootings & set design" } },
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
            "name": t("events.faq_1_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("events.faq_1_a"),
            },
          },
          {
            "@type": "Question",
            "name": t("events.faq_2_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("events.faq_2_a"),
            },
          },
          {
            "@type": "Question",
            "name": t("events.faq_3_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("events.faq_3_a"),
            },
          },
          {
            "@type": "Question",
            "name": t("events.faq_4_q"),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t("events.faq_4_a"),
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
            "name": t("events.title"),
            "item": `${config.public.siteUrl}${localePath("evenements")}`,
          },
        ],
      }),
    },
  ],
});

const services = computed(() => [
  {
    icon: "Sparkle",
    title: t("events.service_1_title"),
    desc: t("events.service_1_desc"),
  },
  {
    icon: "Buildings",
    title: t("events.service_2_title"),
    desc: t("events.service_2_desc"),
  },
  {
    icon: "FlowerTulip",
    title: t("events.service_3_title"),
    desc: t("events.service_3_desc"),
  },
  {
    icon: "Camera",
    title: t("events.service_4_title"),
    desc: t("events.service_4_desc"),
  },
]);

const reasons = computed(() => [
  { icon: "Palette", title: t("events.why_1_title"), desc: t("events.why_1_desc") },
  { icon: "Leaf", title: t("events.why_2_title"), desc: t("events.why_2_desc") },
  { icon: "Users", title: t("events.why_3_title"), desc: t("events.why_3_desc") },
  { icon: "Clock", title: t("events.why_4_title"), desc: t("events.why_4_desc") },
]);

const faqs = computed(() => [
  { q: t("events.faq_1_q"), a: t("events.faq_1_a") },
  { q: t("events.faq_2_q"), a: t("events.faq_2_a") },
  { q: t("events.faq_3_q"), a: t("events.faq_3_a") },
  { q: t("events.faq_4_q"), a: t("events.faq_4_a") },
]);


// Photos de la section « Abonnement floral » : choisies dans le tableau de
// bord (Photos du site, onglet Entreprises). Image par défaut si vide.
const defaultPhiloImage = {
  public_url: "/images/events/scenographie-florale-boticia.jpg",
  caption: null,
};

const { data: eventsPhotos } = await useFetch("/api/photos/events");
const subscriptionPhoto = (i) =>
  eventsPhotos.value?.data?.subscription?.[i] || defaultPhiloImage;
const philosophyImage1 = computed(() => subscriptionPhoto(0));
const philosophyImage2 = computed(() => subscriptionPhoto(1));

// Placeholder images until gallery "events" is created in Supabase
const placeholders = [
  { id: "p1", public_url: "/images/events/composition_florale_table_mariage_boticia.jpg", caption: "" },
  { id: "p2", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg", caption: "" },
  { id: "p3", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_11.jpg", caption: "" },
  { id: "p4", public_url: "/images/events/scenographie-florale-boticia.jpg", caption: "" },
  { id: "p5", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_42.jpg", caption: "" },
  { id: "p6", public_url: "/images/events/atelier_composition_florale_team_building_boticia_3.jpg", caption: "" },
];

</script>
