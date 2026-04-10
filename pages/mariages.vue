<template>
  <div>
    <!-- Hero -->
    <WeddingIntroSection title-tag="h1" />

    <!-- Wedding gallery -->
    <section
      v-if="galleryImages.length > 0"
      class="py-16 md:py-24 bg-white"
    >
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <span class="section-tagline">
            {{ $t("weddings.gallery_tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("weddings.gallery_title") }}
          </h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <button
            v-for="(img, i) in galleryImages"
            :key="img.id"
            class="group cursor-pointer block w-full"
            @click="openLightbox(i)"
          >
            <div class="rounded-2xl overflow-hidden aspect-[3/4]">
              <img
                :src="img.public_url"
                :alt="img.caption || 'Création florale Boticia'"
                loading="lazy"
                class="w-full h-full object-cover
                       group-hover:scale-105
                       transition-transform duration-500"
              />
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Prestations détaillées -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <span class="section-tagline">{{ $t("weddings.services_tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("weddings.services_title") }}</h2>
          <p class="mt-4 text-dark/70 max-w-2xl mx-auto text-lg leading-relaxed">
            {{ $t("weddings.services_intro") }}
          </p>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="svc in services"
            :key="svc.icon"
            class="flex items-start gap-4 bg-cream-light rounded-2xl px-6 py-6"
          >
            <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
              <IconLucid :name="svc.icon" size="md" :stroke-width="1.5" class="text-dark" />
            </div>
            <div>
              <h3 class="font-heading text-lg text-dark mb-1">{{ svc.title }}</h3>
              <p class="text-dark/60 leading-relaxed">{{ svc.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pourquoi nous choisir -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <span class="section-tagline">{{ $t("weddings.why_tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("weddings.why_title") }}</h2>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="reason in reasons"
            :key="reason.icon"
            class="bg-white rounded-2xl px-6 py-6"
          >
            <div class="w-10 h-10 rounded-full bg-cream-light flex items-center justify-center mb-4">
              <IconLucid :name="reason.icon" size="sm" :stroke-width="1.5" class="text-dark" />
            </div>
            <h3 class="font-heading text-lg text-dark mb-2">{{ reason.title }}</h3>
            <p class="text-dark/60 leading-relaxed">{{ reason.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- A la carte -->
    <AlaCarteSection />

    <!-- FAQ mariage -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <span class="section-tagline">{{ $t("weddings.faq_tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("weddings.faq_title") }}</h2>
        </div>
        <div class="max-w-3xl mx-auto space-y-0">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="border-t border-dark/10"
            :class="{ 'border-b': i === faqs.length - 1 }"
          >
            <button
              class="w-full text-left py-5 flex justify-between items-center group"
              @click="openFaq === i ? openFaq = null : openFaq = i"
            >
              <span class="font-heading text-dark/80 text-lg pr-8 group-hover:text-dark transition-colors">
                {{ faq.q }}
              </span>
              <IconLucid
                :name="openFaq === i ? 'Minus' : 'Plus'"
                size="sm"
                class="text-dark/30 shrink-0"
              />
            </button>
            <div v-if="openFaq === i" class="pb-5">
              <p class="text-dark/55 text-base leading-relaxed max-w-2xl">
                {{ faq.a }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("weddings.cta_title") }}
        </h2>
        <p class="text-dark/60 mb-8 text-lg max-w-xl mx-auto">
          {{ $t("weddings.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
          {{ $t("weddings.cta") }}
        </Button>
      </div>
    </section>

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="galleryImages"
      :title="$t('weddings.gallery_title')"
      :start-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
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
  ogTitle: `${t("weddings.title")} | Boticia Côte d'Azur`,
  ogDescription: t("weddings.intro"),
  ogUrl: `${config.public.siteUrl}${route.fullPath}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: `${t("weddings.title")} | Boticia Côte d'Azur`,
  twitterDescription: t("weddings.intro"),
});

useHead({
  title: t("weddings.title") + " | Boticia Côte d'Azur",
  meta: [{ name: "description", content: t("weddings.intro") }],
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

const services = computed(() => [
  { icon: "Flower2", title: t("weddings.service_bouquet_title"), desc: t("weddings.service_bouquet_desc") },
  { icon: "Church", title: t("weddings.service_ceremony_title"), desc: t("weddings.service_ceremony_desc") },
  { icon: "UtensilsCrossed", title: t("weddings.service_reception_title"), desc: t("weddings.service_reception_desc") },
  { icon: "Crown", title: t("weddings.service_accessories_title"), desc: t("weddings.service_accessories_desc") },
]);

const reasons = computed(() => [
  { icon: "Leaf", title: t("weddings.why_1_title"), desc: t("weddings.why_1_desc") },
  { icon: "Heart", title: t("weddings.why_2_title"), desc: t("weddings.why_2_desc") },
  { icon: "Monitor", title: t("weddings.why_3_title"), desc: t("weddings.why_3_desc") },
  { icon: "MapPin", title: t("weddings.why_4_title"), desc: t("weddings.why_4_desc") },
]);

const faqs = computed(() => [
  { q: t("weddings.faq_1_q"), a: t("weddings.faq_1_a") },
  { q: t("weddings.faq_2_q"), a: t("weddings.faq_2_a") },
  { q: t("weddings.faq_3_q"), a: t("weddings.faq_3_a") },
  { q: t("weddings.faq_4_q"), a: t("weddings.faq_4_a") },
]);

const openFaq = ref(null);

const galleryImages = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const { data: galleryData } = await useFetch(
  "/api/galleries/wedding"
);
if (galleryData.value?.data) {
  galleryImages.value = galleryData.value.data;
}
</script>
