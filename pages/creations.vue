<template>
  <div>
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-6">
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="section-tagline">
            {{ $t("creations.tagline") }}
          </span>
          <h1 class="section-title-lg">
            {{ $t("creations.title") }}
          </h1>
          <p class="mt-4 text-dark/60 max-w-xl mx-auto text-lg">
            {{ $t("creations.subtitle") }}
          </p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="py-12 text-center">
          <IconLucid
            name="Loader2"
            size="lg"
            class="animate-spin mx-auto text-dark/30"
          />
        </div>

        <!-- Empty state -->
        <div v-else-if="galleryImages.length === 0" class="py-16 text-center">
          <IconLucid name="Image" size="lg" class="mx-auto text-dark/20 mb-4" />
          <p class="text-dark/40">{{ $t("creations.empty") }}</p>
        </div>

        <!-- Masonry gallery -->
        <div
          v-else
          class="columns-2 sm:columns-3 gap-4 space-y-4"
        >
          <button
            v-for="(img, i) in galleryImages"
            :key="img.id"
            class="break-inside-avoid group cursor-pointer block w-full"
            @click="openLightbox(i)"
          >
            <div
              class="rounded-2xl overflow-hidden"
              :class="sizeClass(i)"
            >
              <img
                :src="img.public_url"
                :alt="img.caption || $t('creations.photo_alt')"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </button>
        </div>

        <!-- CTA -->
        <div class="text-center mt-16">
          <p class="text-dark/60 mb-6 text-lg">
            {{ $t("creations.cta_hint") }}
          </p>
          <Button
            variant="primary"
            icon="MoveRight"
            :to="localePath('/devis')"
          >
            {{ $t("creations.cta") }}
          </Button>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
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
});

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
  title: `${t("creations.title")} | Boticia Côte d'Azur`,
  meta: [{ name: "description", content: t("creations.subtitle") }],
});

const loading = ref(true);
const galleryImages = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const sizeClass = (i) => {
  const pattern = i % 6;
  if (pattern === 0) return "aspect-[3/4]";
  if (pattern === 1) return "aspect-square";
  if (pattern === 2) return "aspect-[4/3]";
  if (pattern === 3) return "aspect-[4/5]";
  if (pattern === 4) return "aspect-square";
  return "aspect-[3/4]";
};

const { data: galleryData } = await useFetch("/api/galleries/creations");
if (galleryData.value?.data) {
  galleryImages.value = galleryData.value.data;
}
loading.value = false;
</script>
