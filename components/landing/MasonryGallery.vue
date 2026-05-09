<template>
  <section
    class="py-16 md:py-24 bg-cream-light overflow-hidden"
  >
    <div class="px-5 sm:px-10 mb-10">
      <div class="max-w-6xl mx-auto">
        <span class="section-tagline">{{ $t("portfolio.tagline") }}</span>
        <h2 class="section-title-lg">{{ $t("portfolio.title") }}</h2>
      </div>
    </div>

    <div class="px-5 sm:px-10">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">

        <!-- Bento principal (2 colonnes, 3 lignes) -->
        <div class="flex-[3] space-y-4">
          <!-- Row 1 : wide + portrait -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="group cursor-pointer block sm:flex-[2] min-w-0"
              @click="openLightbox(mainImages[0])"
            >
              <div
                class="relative w-full h-full min-h-[250px]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  v-if="mainImages[0] && !mainImages[0].isPlaceholder"
                  :src="mainImages[0].public_url"
                  :alt="mainImages[0].caption || $t('portfolio.photo_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
            <button
              class="group cursor-pointer block sm:flex-[1] min-w-0"
              @click="openLightbox(mainImages[1])"
            >
              <div
                class="relative aspect-[3/4]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  v-if="mainImages[1] && !mainImages[1].isPlaceholder"
                  :src="mainImages[1].public_url"
                  :alt="mainImages[1].caption || $t('portfolio.photo_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
          </div>

          <!-- Row 2 : portrait + wide -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="group cursor-pointer block sm:flex-[1] min-w-0"
              @click="openLightbox(mainImages[2])"
            >
              <div
                class="relative aspect-[3/4]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  v-if="mainImages[2] && !mainImages[2].isPlaceholder"
                  :src="mainImages[2].public_url"
                  :alt="mainImages[2].caption || $t('portfolio.photo_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
            <button
              class="group cursor-pointer block sm:flex-[2] min-w-0"
              @click="openLightbox(mainImages[3])"
            >
              <div
                class="relative w-full h-full min-h-[250px]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  v-if="mainImages[3] && !mainImages[3].isPlaceholder"
                  :src="mainImages[3].public_url"
                  :alt="mainImages[3].caption || $t('portfolio.photo_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
          </div>

          <!-- Row 3 : wide + portrait -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="group cursor-pointer block sm:flex-[2] min-w-0"
              @click="openLightbox(mainImages[4])"
            >
              <div
                class="relative w-full h-full min-h-[250px]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  v-if="mainImages[4] && !mainImages[4].isPlaceholder"
                  :src="mainImages[4].public_url"
                  :alt="mainImages[4].caption || $t('portfolio.photo_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
            <button
              class="group cursor-pointer block sm:flex-[1] min-w-0"
              @click="openLightbox(mainImages[5])"
            >
              <div
                class="relative aspect-[3/4]
                       rounded-[1.5rem] overflow-hidden"
              >
                <img
                  v-if="mainImages[5] && !mainImages[5].isPlaceholder"
                  :src="mainImages[5].public_url"
                  :alt="mainImages[5].caption || $t('portfolio.photo_alt')"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover
                         group-hover:scale-[1.03]
                         transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
                <div
                  class="absolute inset-0 bg-dark/0
                         group-hover:bg-dark/8
                         transition-colors duration-500"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- 3ème colonne : petits portraits (desktop uniquement) -->
        <div class="hidden sm:flex flex-[1] flex-col gap-4">
          <button
            v-for="(img, i) in sideImages"
            :key="img.id"
            class="group cursor-pointer block flex-1 min-w-0"
            @click="openLightbox(img)"
          >
            <div
              class="relative w-full h-full min-h-[100px]
                     rounded-[1.5rem] overflow-hidden"
            >
              <img
                v-if="!img.isPlaceholder"
                :src="img.public_url"
                :alt="img.caption || $t('portfolio.photo_alt')"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover
                       group-hover:scale-[1.03]
                       transition-transform duration-700 ease-out"
              />
              <div v-else class="absolute inset-0 bg-stone-200 animate-pulse" />
              <div
                class="absolute inset-0 bg-dark/0
                       group-hover:bg-dark/8
                       transition-colors duration-500"
              />
              <!-- "+N" overlay sur la dernière image -->
              <div
                v-if="i === sideImages.length - 1 && remainingCount > 0"
                class="absolute inset-0 bg-dark/40
                       flex items-center justify-center
                       group-hover:bg-dark/50
                       transition-colors duration-500"
              >
                <span
                  class="text-cream font-heading text-4xl
                         md:text-5xl font-medium"
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

const TOTAL_SLOTS = 9;
const SIMULATE_TOTAL = 20;

const images = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (img) => {
  if (!img || img.isPlaceholder) return;
  const idx = images.value.findIndex((r) => r.id === img.id);
  if (idx < 0) return;
  lightboxIndex.value = idx;
  lightboxOpen.value = true;
};

// Build display source: real images + placeholders up to SIMULATE_TOTAL
const displaySource = computed(() => {
  const placeholderCount = Math.max(0, SIMULATE_TOTAL - images.value.length);
  const placeholders = Array.from({ length: placeholderCount }, (_, i) => ({
    id: `placeholder-${i}`,
    public_url: null,
    caption: null,
    bento_slot: null,
    isPlaceholder: true,
  }));
  return [...images.value, ...placeholders];
});

// Place images in slots 1-9 → indices 0-8
const allDisplayImages = computed(() => {
  const result = new Array(TOTAL_SLOTS).fill(null);
  const used = new Set();
  for (const img of displaySource.value) {
    if (img.bento_slot >= 1 && img.bento_slot <= TOTAL_SLOTS) {
      result[img.bento_slot - 1] = img;
      used.add(img.id);
    }
  }
  const rest = displaySource.value.filter((img) => !used.has(img.id));
  let restIdx = 0;
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    if (!result[i] && restIdx < rest.length) {
      result[i] = rest[restIdx++];
    }
  }
  // Always return TOTAL_SLOTS items (pad with placeholders if needed)
  return result.map((item, i) =>
    item ?? { id: `pad-${i}`, public_url: null, caption: null, bento_slot: null, isPlaceholder: true }
  );
});

const mainImages = computed(() => allDisplayImages.value.slice(0, 6));
const sideImages = computed(() => allDisplayImages.value.slice(6, 9));
const remainingCount = computed(() => Math.max(0, SIMULATE_TOTAL - TOTAL_SLOTS));

const { data: galleryData } = await useFetch("/api/galleries/portfolio");
if (galleryData.value?.data) {
  images.value = galleryData.value.data;
}
</script>
