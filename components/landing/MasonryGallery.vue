<template>
  <section
    v-if="images.length > 0"
    class="py-16 md:py-24 bg-cream-light overflow-hidden"
  >
    <div class="px-5 sm:px-10 mb-10">
      <span class="section-tagline">{{ $t("portfolio.tagline") }}</span>
      <h2 class="section-title-lg">{{ $t("portfolio.title") }}</h2>
    </div>

    <!-- Masonry grid -->
    <div class="px-5 sm:px-10">
      <div class="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4">
        <button
          v-for="(img, i) in images"
          :key="img.id"
          class="break-inside-avoid mb-3 md:mb-4 group cursor-pointer block w-full"
          @click="openLightbox(i)"
        >
          <div
            class="rounded-2xl overflow-hidden"
            :class="sizeClass(i)"
          >
            <img
              :src="img.public_url"
              :alt="img.caption || $t('portfolio.photo_alt')"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="images"
      :title="$t('portfolio.title')"
      :start-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </section>
</template>

<script setup>
const { t } = useI18n();

const images = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

// Varied sizes for masonry effect
const sizeClass = (i) => {
  const pattern = i % 6;
  if (pattern === 0) return "aspect-[3/4]";   // Portrait tall
  if (pattern === 1) return "aspect-square";    // Square
  if (pattern === 2) return "aspect-[4/3]";     // Landscape
  if (pattern === 3) return "aspect-[3/4]";     // Portrait tall
  if (pattern === 4) return "aspect-[4/5]";     // Portrait
  return "aspect-square";                        // Square
};

const { data: galleryData } = await useFetch("/api/galleries/portfolio");
if (galleryData.value?.data) {
  images.value = galleryData.value.data;
}
</script>
