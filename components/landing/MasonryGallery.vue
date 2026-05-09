<template>
  <section
    v-if="images.length > 0"
    class="py-16 md:py-24 bg-cream-light overflow-hidden"
  >
    <div class="px-5 sm:px-10 mb-10">
      <div class="max-w-5xl mx-auto">
        <span class="section-tagline">{{ $t("portfolio.tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("portfolio.title") }}</h2>
      </div>
    </div>

    <!-- Grille portraits -->
    <div class="px-5 sm:px-10">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            v-for="(img, index) in displayImages"
            :key="img.id"
            class="group cursor-pointer block relative"
            @click="openLightbox(index)"
          >
            <div
              class="relative aspect-[2/3] rounded-[1.5rem] overflow-hidden"
            >
              <img
                :src="img.public_url"
                :alt="img.caption || $t('portfolio.photo_alt')"
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
              <!-- "+N" overlay sur la dernière carte -->
              <div
                v-if="index === displayImages.length - 1 && remainingCount > 0"
                class="absolute inset-0 bg-dark/40
                       flex items-center justify-center
                       group-hover:bg-dark/50
                       transition-colors duration-500"
              >
                <span
                  class="text-cream font-heading text-5xl
                         md:text-7xl font-medium"
                >
                  +{{ remainingCount }}
                </span>
              </div>
            </div>
          </button>
        </div>
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

// Place images in their exact bento_slot position (1-6 → index 0-5)
// Fill empty slots with remaining images
const displayImages = computed(() => {
  const result = new Array(6).fill(null);
  const used = new Set();
  for (const img of images.value) {
    if (img.bento_slot >= 1 && img.bento_slot <= 6) {
      result[img.bento_slot - 1] = img;
      used.add(img.id);
    }
  }
  const rest = images.value.filter((img) => !used.has(img.id));
  let restIdx = 0;
  for (let i = 0; i < 6; i++) {
    if (!result[i] && restIdx < rest.length) {
      result[i] = rest[restIdx++];
    }
  }
  return result.filter(Boolean);
});

const remainingCount = computed(() => Math.max(0, images.value.length - 6));

const { data: galleryData } = await useFetch("/api/galleries/portfolio");
if (galleryData.value?.data) {
  images.value = galleryData.value.data;
}
</script>
