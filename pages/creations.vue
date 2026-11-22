<template>
  <!-- ==========================================
       [PAGE-CREATIONS] — Portfolio mariage, mise en page « éditorial magazine »
       Les photos dominent. Le texte tient dans une colonne étroite.
       Mise en page asymétrique, rythme photo / texte qui alterne.
       ========================================== -->
  <div class="overflow-x-clip bg-white">
    <!-- [SPREAD-OUVERTURE] — Titre étroit à gauche, grande photo à droite -->
    <section class="pt-10 md:pt-20 pb-16 md:pb-28">
      <div class="px-5 sm:px-10">
        <div
          class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12
                 gap-10 md:gap-8 items-start"
        >
          <!-- Titre aligné sur le haut de la photo -->
          <div class="md:col-span-5 md:pt-2 md:pr-6">
            <span class="section-tagline">
              {{ $t("creations.tagline") }}
            </span>
            <h1
              class="font-heading text-[2.75rem] leading-[1.05] md:text-5xl
                     lg:text-6xl text-dark mt-5 text-balance hyphens-none"
            >
              {{ $t("creations.title") }}
            </h1>
            <div class="w-12 border-t border-dark mt-8" />
            <p class="para mt-6 max-w-sm">
              {{ $t("creations.subtitle") }}
            </p>
            <Button
              variant="link"
              :to="localePath('mariages')"
              class="mt-8"
            >
              {{ $t("creations.weddings_link") }}
            </Button>
          </div>

          <div class="md:col-span-7 md:col-start-6 -mx-5 sm:mx-0 relative">
            <button
              v-if="photo(openingIndex)"
              class="group block w-full cursor-pointer"
              @click="openLightbox(openingIndex)"
            >
              <div class="overflow-hidden aspect-[4/5] md:aspect-[5/6]">
                <img
                  :src="photo(openingIndex).public_url"
                  :alt="
                    photo(openingIndex).caption || $t('creations.photo_alt')
                  "
                  class="w-full h-full object-cover transition-transform
                         duration-[1200ms] ease-out group-hover:scale-[1.02]"
                />
              </div>
            </button>
            <div
              v-else-if="galleryImages.length === 0"
              class="aspect-[4/5] md:aspect-[5/6] bg-cream-light flex
                     items-center justify-center"
            >
              <p class="para-small">{{ $t("creations.empty") }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- [EDITO] — Une seule colonne de lecture, sous l'ouverture -->
    <section class="pb-20 md:pb-28">
      <div class="px-5 sm:px-10">
        <div
          class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          <!-- Aligné sur le bord gauche de la grande photo, sans filet -->
          <div class="md:col-span-6 md:col-start-6 space-y-6">
            <p class="para-lead">{{ $t("creations.intro_p1") }}</p>
            <p class="para-lead">{{ $t("creations.intro_p2") }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- [CHAPITRES] — 4 chapitres, une catégorie par chapitre (choisie par
         Laëtitia dans le tableau de bord). Même gabarit pour tous : texte
         sur 4 colonnes, photos sur 7, côtés alternés. Sans photo, le
         chapitre garde son texte. -->
    <section>
      <div class="px-5 sm:px-10">
        <div class="max-w-7xl mx-auto">
          <article
            v-for="(chapter, c) in chapters"
            :key="chapter.key"
            class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8
                   items-center py-16 md:py-24 border-t border-dark/20"
          >
            <!-- Texte -->
            <div
              class="md:col-span-4"
              :class="
                c % 2 === 0
                  ? 'md:col-start-1 md:order-1'
                  : 'md:col-start-9 md:order-2'
              "
            >
              <!-- Surtitre orange, comme les autres sections du site -->
              <p class="section-tagline">
                {{ $t(`creations.chapter_${chapter.key}_tagline`) }}
              </p>
              <h2 class="section-title-lg text-balance">
                {{ $t(`creations.chapter_${chapter.key}_title`) }}
              </h2>
              <div class="w-12 border-t border-dark mt-6" />
              <p class="para mt-6">
                {{ $t(`creations.chapter_${chapter.key}_desc`) }}
              </p>
            </div>

            <!-- Photos : 1 seule en portrait, ou 2 en diptyque décalé -->
            <div
              v-if="chapter.photos.length"
              class="md:col-span-7"
              :class="
                c % 2 === 0
                  ? 'md:col-start-6 md:order-2'
                  : 'md:col-start-1 md:order-1'
              "
            >
              <div
                class="grid gap-3 md:gap-4"
                :class="
                  chapter.photos.length === 2
                    ? 'grid-cols-2 items-start'
                    : ''
                "
              >
                <button
                  v-for="(item, p) in chapter.photos"
                  :key="item.img.id"
                  class="group block w-full cursor-pointer"
                  :class="photoClass(chapter.photos.length, p, c)"
                  :style="chapter.photos.length === 1 ? { width: '70%' } : null"
                  @click="openLightbox(item.index)"
                >
                  <div
                    class="overflow-hidden h-full"
                    :class="photoAspect(chapter.photos.length, p)"
                  >
                    <img
                      :src="item.img.public_url"
                      :alt="
                        item.img.caption ||
                        `${$t(`creations.chapter_${chapter.key}_title`)}, Boticia`
                      "
                      loading="lazy"
                      class="w-full h-full object-cover transition-transform
                             duration-[1200ms] ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                </button>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>

    <!-- [CTA] — Une seule fin de page, dans le prolongement du dernier
         chapitre : titre et bouton devis (le lien Mariages est en haut) -->
    <section class="pb-24 md:pb-32">
      <div class="px-5 sm:px-10">
        <div
          class="max-w-7xl mx-auto border-t border-dark/20 pt-16 md:pt-24
                 text-center"
        >
          <p
            class="font-heading text-3xl md:text-5xl leading-tight text-dark
                   max-w-3xl mx-auto text-balance"
          >
            {{ $t("creations.cta_hint") }}
          </p>
          <div
            class="mt-10 flex flex-col sm:flex-row items-center
                   justify-center gap-6 sm:gap-10"
          >
            <Button variant="cta" :to="localePath('devis')">
              {{ $t("creations.cta") }}
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox : s'ouvre au clic sur n'importe quelle photo -->

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="galleryImages"
      :title="$t('creations.title')"
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
  layoutTransition: false,
});

// Adresses traduites : l'anglais et le japonais ont une adresse en anglais.
// Les anciennes (/en/creations…) redirigent en 301, voir server/middleware/redirects.ts
defineI18nRoute({
  paths: {
    fr: "/creations",
    en: "/portfolio",
    ja: "/portfolio",
  },
});

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
  title: `${t("seo.creations_title")} | Boticia Provence`,
  meta: [
    { name: "description", content: t("seo.creations_description") },
  ],
});

// Photos choisies dans le tableau de bord (page « Photos », Créations) :
// une ouverture, puis 4 chapitres de 2 photos au plus.
const CHAPTER_KEYS = ["bouquets", "ceremonie", "reception", "accessoires"];

const pagePhotos = ref({});
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

// Toutes les photos de la page, dans l'ordre : la visionneuse les parcourt
const galleryImages = computed(() =>
  [
    ...(pagePhotos.value.opening ?? []),
    ...CHAPTER_KEYS.flatMap((key) => pagePhotos.value[key] ?? []),
  ].filter(Boolean),
);

const photo = (i) => galleryImages.value[i] || null;

// Photo d'ouverture : la première de la liste, si elle a été choisie
const openingIndex = computed(() =>
  pagePhotos.value.opening?.[0] ? 0 : -1,
);

const chapters = computed(() =>
  CHAPTER_KEYS.map((key) => ({
    key,
    photos: (pagePhotos.value[key] ?? [])
      .filter(Boolean)
      .map((img) => ({
        img,
        index: galleryImages.value.findIndex((g) => g.id === img.id),
      })),
  })),
);

// 2 photos : diptyque, même format, la 2e décalée vers le bas.
// 1 photo : portrait comme le reste de la page, rapprochée du texte.
const photoClass = (count, p, c) => {
  if (count === 1) return c % 2 === 0 ? "mr-auto" : "ml-auto";
  if (count === 2) return p === 0 ? "col-span-1" : "col-span-1 mt-12 md:mt-20";
  return "";
};

const photoAspect = (count, p) => {
  if (count === 1) return "aspect-[4/5]";
  if (count === 2) return "aspect-[3/4]";
  return p === 0 ? "aspect-[4/5]" : "aspect-[3/4]";
};

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const { data: photosData } = await useFetch("/api/photos/creations");
if (photosData.value?.data) {
  pagePhotos.value = photosData.value.data;
}
</script>
