<template>
  <div>
    <!-- Hero + Services -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("events.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("events.title") }}
            </h1>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("events.intro") }}
            </p>
            <Button
              variant="primary"
              icon="MoveRight"
              :to="localePath('/devis')"
              class="mt-8"
            >
              {{ $t("events.cta") }}
            </Button>
          </div>
          <!-- Visual: services -->
          <div class="space-y-5">
            <div
              v-for="(service, i) in services"
              :key="i"
              class="flex items-start gap-4 bg-white rounded-2xl px-6 py-5"
            >
              <div
                class="w-12 h-12 rounded-xl bg-cream-light flex items-center
                       justify-center shrink-0"
              >
                <IconLucid :name="service.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <div>
                <h3 class="font-heading text-lg text-dark mb-1">
                  {{ service.title }}
                </h3>
                <p class="text-dark/70 leading-relaxed text-base">
                  {{ service.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Images superposées -->
          <div class="relative w-full aspect-square max-w-md mx-auto">
            <div
              class="absolute top-0 left-0 w-[65%] aspect-square
                     rounded-[2rem] overflow-hidden shadow-lg
                     border-2 border-dark/10 z-10"
            >
              <img
                :src="philosophyImage1"
                :alt="$t('events.philosophy_title')"
                loading="lazy"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="absolute bottom-0 right-0 w-[65%] aspect-square
                     rounded-[2rem] overflow-hidden shadow-lg
                     border-2 border-dark/10"
            >
              <img
                :src="philosophyImage2"
                :alt="$t('events.philosophy_title')"
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
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("events.philosophy_p1") }}
            </p>
            <p class="mt-4 text-dark/70 text-lg leading-relaxed">
              {{ $t("events.philosophy_p2") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery — bento layout -->
    <section
      v-if="displayGallery.length > 0"
      class="py-16 md:py-24 bg-cream-light"
    >
      <div class="px-5 sm:px-10">
        <div class="max-w-6xl mx-auto mb-12">
          <span class="section-tagline">
            {{ $t("events.gallery_tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("events.gallery_title") }}
          </h2>
        </div>

        <div class="max-w-6xl mx-auto space-y-4">
          <!-- Row 1 : wide + square -->
          <div
            v-if="displayGallery[0]"
            class="flex flex-col sm:flex-row gap-4"
          >
            <button
              class="group cursor-pointer block sm:flex-[2] min-w-0"
              @click="openLightbox(0)"
            >
              <div
                class="relative w-full h-full min-h-[250px]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  :src="displayGallery[0].public_url"
                  :alt="displayGallery[0].caption || $t('events.gallery_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
            <button
              v-if="displayGallery[1]"
              class="group cursor-pointer block sm:flex-[1] min-w-0"
              @click="openLightbox(1)"
            >
              <div
                class="relative aspect-square
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  :src="displayGallery[1].public_url"
                  :alt="displayGallery[1].caption || $t('events.gallery_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
          </div>

          <!-- Row 2 : square + wide -->
          <div
            v-if="displayGallery[2]"
            class="flex flex-col sm:flex-row gap-4"
          >
            <button
              class="group cursor-pointer block sm:flex-[1] min-w-0"
              @click="openLightbox(2)"
            >
              <div
                class="relative aspect-square
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  :src="displayGallery[2].public_url"
                  :alt="displayGallery[2].caption || $t('events.gallery_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
            <button
              v-if="displayGallery[3]"
              class="group cursor-pointer block sm:flex-[2] min-w-0"
              @click="openLightbox(3)"
            >
              <div
                class="relative w-full h-full min-h-[250px]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  :src="displayGallery[3].public_url"
                  :alt="displayGallery[3].caption || $t('events.gallery_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
          </div>

          <!-- Row 3 : wide + square (+N overlay) -->
          <div
            v-if="displayGallery[4]"
            class="flex flex-col sm:flex-row gap-4"
          >
            <button
              class="group cursor-pointer block sm:flex-[2] min-w-0"
              @click="openLightbox(4)"
            >
              <div
                class="relative w-full h-full min-h-[250px]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  :src="displayGallery[4].public_url"
                  :alt="displayGallery[4].caption || $t('events.gallery_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
            <button
              v-if="displayGallery[5]"
              class="group cursor-pointer block sm:flex-[1] min-w-0"
              @click="openLightbox(5)"
            >
              <div
                class="relative aspect-square
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  :src="displayGallery[5].public_url"
                  :alt="displayGallery[5].caption || $t('events.gallery_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
                <div
                  v-if="remainingGallery > 0"
                  class="absolute inset-0 bg-dark/40
                         flex items-center justify-center
                         group-hover:bg-dark/50
                         transition-colors duration-500"
                >
                  <span
                    class="text-cream font-heading text-5xl
                           md:text-7xl font-medium"
                  >
                    +{{ remainingGallery }}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="galleryImages"
      :title="$t('events.gallery_title')"
      :start-index="lightboxIndex"
      @close="lightboxOpen = false"
    />

    <!-- Pourquoi nous choisir -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <span class="section-tagline">{{ $t("events.why_tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("events.why_title") }}</h2>
        </div>
        <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="reason in reasons"
            :key="reason.icon"
            class="bg-cream-light rounded-2xl px-6 py-6"
          >
            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4">
              <IconLucid :name="reason.icon" size="sm" :stroke-width="1.5" class="text-dark" />
            </div>
            <h3 class="font-heading text-lg text-dark mb-2">{{ reason.title }}</h3>
            <p class="text-dark/60 leading-relaxed">{{ reason.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ événements -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="text-center mb-14">
          <span class="section-tagline">{{ $t("events.faq_tagline") }}</span>
          <h2 class="section-title-lg">{{ $t("events.faq_title") }}</h2>
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
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("events.cta_title") }}
        </h2>
        <p class="text-dark/70 mb-8 text-lg max-w-xl mx-auto">
          {{ $t("events.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
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

const { t, locale } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const route = useRoute();

useSeoMeta({
  ogTitle: `${t("events.title")} | Boticia Provence`,
  ogDescription: t("events.intro"),
  ogUrl: `${config.public.siteUrl}${route.fullPath}`,
  ogLocale: locale.value === "fr" ? "fr_FR" : locale.value === "ja" ? "ja_JP" : "en_US",
  ogType: "website",
  twitterTitle: `${t("events.title")} | Boticia Provence`,
  twitterDescription: t("events.intro"),
});

useHead({
  title: t("events.title") + " | Boticia Provence",
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
            "item": `${config.public.siteUrl}/${locale.value}/evenements`,
          },
        ],
      }),
    },
  ],
});

const services = computed(() => [
  {
    icon: "Sparkles",
    title: t("events.service_1_title"),
    desc: t("events.service_1_desc"),
  },
  {
    icon: "Building2",
    title: t("events.service_2_title"),
    desc: t("events.service_2_desc"),
  },
  {
    icon: "Flower2",
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

const openFaq = ref(null);

const defaultPhiloImage = "/images/events/scenographie-florale-boticia.jpg";

const { data: philoConfig1 } = await useFetch("/api/cms/config", {
  params: { key: "events_philosophy_image_1" },
});
const { data: philoConfig2 } = await useFetch("/api/cms/config", {
  params: { key: "events_philosophy_image_2" },
});

const philosophyImage1 = computed(
  () => philoConfig1.value?.data?.value?.url || defaultPhiloImage
);
const philosophyImage2 = computed(
  () => philoConfig2.value?.data?.value?.url || defaultPhiloImage
);

// Placeholder images until gallery "events" is created in Supabase
const placeholders = [
  { id: "p1", public_url: "/images/events/composition_florale_table_mariage_boticia.jpg", caption: "" },
  { id: "p2", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg", caption: "" },
  { id: "p3", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_11.jpg", caption: "" },
  { id: "p4", public_url: "/images/events/scenographie-florale-boticia.jpg", caption: "" },
  { id: "p5", public_url: "/images/events/decoration_florale_mariage_sophiethomas_boticia_42.jpg", caption: "" },
  { id: "p6", public_url: "/images/events/atelier_composition_florale_team_building_boticia_3.jpg", caption: "" },
];

const galleryImages = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const displayGallery = computed(() => galleryImages.value.slice(0, 6));
const remainingGallery = computed(() => Math.max(0, galleryImages.value.length - 6));

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const { data: galleryData } = await useFetch(
  "/api/galleries/events"
);
if (galleryData.value?.data && galleryData.value.data.length > 0) {
  galleryImages.value = galleryData.value.data;
} else {
  galleryImages.value = placeholders;
}
</script>
