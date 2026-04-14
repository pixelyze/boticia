<template>
  <section
    v-if="images.length > 0"
    class="py-16 md:py-24 bg-cream-light overflow-hidden"
  >
    <div class="px-5 sm:px-10 mb-10">
      <div class="max-w-6xl mx-auto">
        <span class="section-tagline">{{ $t("portfolio.tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("portfolio.title") }}</h2>
      </div>
    </div>

    <!-- Bento rows -->
    <div class="px-5 sm:px-10">
      <div class="max-w-6xl mx-auto space-y-4">
        <!-- Row 1 : wide + square -->
        <div
          v-if="displayImages[0]"
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
                :src="displayImages[0].public_url"
                :alt="displayImages[0].caption || $t('portfolio.photo_alt')"
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
            v-if="displayImages[1]"
            class="group cursor-pointer block sm:flex-[1] min-w-0"
            @click="openLightbox(1)"
          >
            <div
              class="relative aspect-square
                     rounded-[1.5rem] overflow-hidden"
            >
              <img
                :src="displayImages[1].public_url"
                :alt="displayImages[1].caption || $t('portfolio.photo_alt')"
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
          v-if="displayImages[2]"
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
                :src="displayImages[2].public_url"
                :alt="displayImages[2].caption || $t('portfolio.photo_alt')"
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
            v-if="displayImages[3]"
            class="group cursor-pointer block sm:flex-[2] min-w-0"
            @click="openLightbox(3)"
          >
            <div
              class="relative w-full h-full min-h-[250px]
                     rounded-[1.5rem] overflow-hidden"
            >
              <img
                :src="displayImages[3].public_url"
                :alt="displayImages[3].caption || $t('portfolio.photo_alt')"
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

        <!-- Row 3 : wide + square -->
        <div
          v-if="displayImages[4]"
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
                :src="displayImages[4].public_url"
                :alt="displayImages[4].caption || $t('portfolio.photo_alt')"
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
            v-if="displayImages[5]"
            class="group cursor-pointer block sm:flex-[1] min-w-0"
            @click="openLightbox(5)"
          >
            <div
              class="relative aspect-square
                     rounded-[1.5rem] overflow-hidden"
            >
              <img
                :src="displayImages[5].public_url"
                :alt="displayImages[5].caption || $t('portfolio.photo_alt')"
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
              <!-- "+N" overlay -->
              <div
                v-if="remainingCount > 0"
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
  // Place slotted images at their exact position
  for (const img of images.value) {
    if (img.bento_slot >= 1 && img.bento_slot <= 6) {
      result[img.bento_slot - 1] = img;
      used.add(img.id);
    }
  }
  // Fill empty positions with remaining images
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
