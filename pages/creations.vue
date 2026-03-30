<template>
  <div>
    <!-- Hero banner -->
    <section class="relative h-[50vh] md:h-[60vh] bg-dark overflow-hidden flex items-end">
      <img
        v-if="categories.length > 0 && categories[0].cover_public_url"
        :src="categories[0].cover_public_url"
        alt="Boticia créations florales"
        class="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
      <div class="relative container mx-auto px-6 pb-12 md:pb-16">
        <span class="text-cream/50 text-xs md:text-sm uppercase tracking-[0.4em] block mb-3">
          {{ $t("creations.tagline") }}
        </span>
        <h1 class="font-heading text-3xl md:text-5xl font-medium text-cream leading-tight max-w-2xl">
          {{ $t("creations.title") }}
        </h1>
        <p class="mt-4 text-cream/60 text-base md:text-lg max-w-xl leading-relaxed">
          {{ $t("creations.subtitle") }}
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6">
        <!-- Loading -->
        <div v-if="loading" class="py-12 text-center">
          <IconLucid
            name="Loader2"
            size="lg"
            class="animate-spin mx-auto text-dark/30"
          />
        </div>

        <!-- Masonry grid -->
        <div
          v-else
          class="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          <button
            v-for="(cat, i) in categories"
            :key="cat.id"
            class="group text-left cursor-pointer break-inside-avoid block w-full"
            @click="openLightbox(cat)"
          >
            <div
              class="relative w-full rounded-[1.5rem] overflow-hidden"
              :class="i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'"
            >
              <img
                v-if="cat.cover_public_url"
                :src="cat.cover_public_url"
                :alt="cat.title || $t('stories.' + cat.slug)"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover
                       group-hover:scale-105 transition-transform duration-700"
              />
              <div
                v-else
                class="absolute inset-0 bg-gradient-to-br from-cream to-dark/15"
              />

              <!-- Overlay on hover -->
              <div
                class="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors duration-500"
              />

              <!-- Label -->
              <div class="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-dark/70 to-transparent">
                <span class="text-cream text-lg font-heading font-medium leading-tight block">
                  {{ cat.title || $t("stories." + cat.slug) }}
                </span>
                <span class="text-cream/50 text-sm mt-1 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Voir la galerie
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Stats / trust -->
    <section class="py-12 md:py-16 bg-white">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 text-center">
          <div>
            <span class="font-heading text-4xl md:text-5xl text-dark block">50+</span>
            <span class="text-dark/40 text-sm mt-1 block">{{ $t("creations.stat_events") }}</span>
          </div>
          <div class="hidden md:block w-px h-12 bg-dark/10" />
          <div>
            <span class="font-heading text-4xl md:text-5xl text-dark block">100%</span>
            <span class="text-dark/40 text-sm mt-1 block">{{ $t("creations.stat_flowers") }}</span>
          </div>
          <div class="hidden md:block w-px h-12 bg-dark/10" />
          <div>
            <span class="font-heading text-4xl md:text-5xl text-dark block">5★</span>
            <span class="text-dark/40 text-sm mt-1 block">{{ $t("creations.stat_rating") }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("creations.cta_hint") }}
        </h2>
        <p class="text-dark/50 mb-8 text-lg max-w-md mx-auto">
          {{ $t("creations.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
          {{ $t("creations.cta") }}
        </Button>
      </div>
    </section>

    <!-- Gallery Lightbox -->
    <GalleryLightbox
      :is-open="lightboxOpen"
      :category-slug="lightboxSlug"
      :category-id="lightboxCategoryId"
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

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
  title: `${t("creations.title")} | Boticia Côte d'Azur`,
  meta: [
    { name: "description", content: t("creations.subtitle") },
  ],
});

useSeoMeta({
  ogTitle: `${t("creations.title")} | Boticia Côte d'Azur`,
  ogDescription: t("creations.subtitle"),
});

const loading = ref(true);
const categories = ref([]);

const lightboxOpen = ref(false);
const lightboxSlug = ref("");
const lightboxCategoryId = ref("");

const openLightbox = (cat) => {
  lightboxSlug.value = cat.slug;
  lightboxCategoryId.value = cat.id;
  lightboxOpen.value = true;
};

const { data: apiData } = await useFetch("/api/inspirations/homepage");

if (apiData.value?.data) {
  categories.value = apiData.value.data;
}
loading.value = false;
</script>
