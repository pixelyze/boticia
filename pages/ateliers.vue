<template>
  <div>
    <!-- Hero + Workshop types -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("workshops.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("workshops.title") }}
            </h1>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("workshops.intro") }}
            </p>
            <Button
              variant="primary"
              icon="MoveRight"
              :to="localePath('/devis')"
              class="mt-8"
            >
              {{ $t("workshops.cta") }}
            </Button>
          </div>
          <!-- Visual: workshop types -->
          <div class="space-y-5">
            <div
              v-for="(workshop, i) in workshopTypes"
              :key="i"
              class="flex items-start gap-4 bg-white rounded-2xl px-6 py-5"
            >
              <div
                class="w-12 h-12 rounded-xl bg-cream-light flex items-center
                       justify-center shrink-0"
              >
                <IconLucid :name="workshop.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <div>
                <h3 class="font-heading text-lg text-dark mb-1">
                  {{ workshop.title }}
                </h3>
                <p class="text-dark/70 leading-relaxed text-base">
                  {{ workshop.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Workshop gallery — bento layout -->
    <section
      v-if="displayGallery.length > 0"
      class="py-16 md:py-24 bg-white"
    >
      <div class="px-5 sm:px-10">
        <div class="max-w-6xl mx-auto mb-12">
          <span class="section-tagline">
            {{ $t("workshops.gallery_tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("workshops.gallery_title") }}
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
                  :alt="displayGallery[0].caption || $t('workshops.gallery_alt')"
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
                  :alt="displayGallery[1].caption || $t('workshops.gallery_alt')"
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
                  :alt="displayGallery[2].caption || $t('workshops.gallery_alt')"
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
                  :alt="displayGallery[3].caption || $t('workshops.gallery_alt')"
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
                  :alt="displayGallery[4].caption || $t('workshops.gallery_alt')"
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
                  :alt="displayGallery[5].caption || $t('workshops.gallery_alt')"
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

    <!-- For whom (Pour qui) -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("workshops.audience_tagline") }}
            </span>
            <h2 class="section-title-lg">
              {{ $t("workshops.audience_title") }}
            </h2>
            <p class="mt-4 text-dark/70 text-lg leading-relaxed">
              {{ $t("workshops.audience_desc") }}
            </p>
          </div>
          <!-- Audience cards -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(audience, i) in audiences"
              :key="i"
              class="px-5 py-6 rounded-2xl bg-white text-center"
            >
              <div
                class="w-12 h-12 rounded-xl bg-cream-light flex items-center
                       justify-center mx-auto mb-3"
              >
                <IconLucid :name="audience.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <h3 class="text-base font-semibold text-dark">
                {{ audience.label }}
              </h3>
              <p class="text-dark/70 text-base leading-relaxed mt-2">
                {{ audience.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="galleryImages"
      :title="$t('workshops.gallery_title')"
      :start-index="lightboxIndex"
      @close="lightboxOpen = false"
    />

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("workshops.cta_title") }}
        </h2>
        <p class="text-dark/60 mb-8 text-lg max-w-xl mx-auto">
          {{ $t("workshops.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
          {{ $t("workshops.cta") }}
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

useHead({
  title: t("workshops.title") + " - Boticia",
  meta: [{ name: "description", content: t("workshops.intro") }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Ateliers d'art floral",
        "description": t("workshops.intro"),
        "provider": {
          "@type": "Florist",
          "name": "Boticia",
          "url": siteUrl,
        },
        "serviceType": "Floral Design Workshop",
        "areaServed": {
          "@type": "State",
          "name": "Provence-Alpes-Côte d'Azur",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Ateliers proposés",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": t("workshops.type_1_title") } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": t("workshops.type_2_title") } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": t("workshops.type_3_title") } },
          ],
        },
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
            "name": t("workshops.title"),
            "item": `${siteUrl}/${locale.value}/ateliers`,
          },
        ],
      }),
    },
  ],
});

const workshopTypes = computed(() => [
  {
    icon: "Flower2",

    title: t("workshops.type_1_title"),
    desc: t("workshops.type_1_desc"),
  },
  {
    icon: "Leaf",

    title: t("workshops.type_2_title"),
    desc: t("workshops.type_2_desc"),
  },
  {
    icon: "Palette",

    title: t("workshops.type_3_title"),
    desc: t("workshops.type_3_desc"),
  },
]);

const galleryImages = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const displayGallery = computed(() => {
  const result = new Array(6).fill(null);
  const used = new Set();
  for (const img of galleryImages.value) {
    if (img.bento_slot >= 1 && img.bento_slot <= 6) {
      result[img.bento_slot - 1] = img;
      used.add(img.id);
    }
  }
  const rest = galleryImages.value.filter((img) => !used.has(img.id));
  let restIdx = 0;
  for (let i = 0; i < 6; i++) {
    if (!result[i] && restIdx < rest.length) {
      result[i] = rest[restIdx++];
    }
  }
  return result.filter(Boolean);
});
const remainingGallery = computed(() => Math.max(0, galleryImages.value.length - 6));

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const { data: galleryData } = await useFetch("/api/galleries/workshops");
if (galleryData.value?.data) {
  galleryImages.value = galleryData.value.data;
}

const audiences = computed(() => [
  { icon: "Handshake", label: t("workshops.audience_teambuilding"), desc: t("workshops.audience_teambuilding_desc") },
  { icon: "Heart", label: t("workshops.audience_evjf"), desc: t("workshops.audience_evjf_desc") },
  { icon: "PartyPopper", label: t("workshops.audience_birthday"), desc: t("workshops.audience_birthday_desc") },
  { icon: "Gift", label: t("workshops.audience_private"), desc: t("workshops.audience_private_desc") },
]);
</script>
