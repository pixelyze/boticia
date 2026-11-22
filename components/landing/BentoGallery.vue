<template>
  <section class="py-16 md:py-24 overflow-hidden" :class="bgClass">
    <div class="px-5 sm:px-10 mb-10">
      <div class="max-w-6xl mx-auto">
        <span class="section-tagline">{{ tagline }}</span>
        <h2 class="section-title-lg">{{ title }}</h2>
      </div>
    </div>

    <div class="px-5 sm:px-10">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">

        <!-- Bento principal (2 colonnes, 3 lignes) -->
        <div class="flex-[3] space-y-3 sm:space-y-4">
          <!-- Row 1 : wide + portrait -->
          <div class="flex flex-row gap-3 sm:gap-4">
            <button
              class="group cursor-pointer block flex-[2] min-w-0"
              @click="openLightbox(mainImages[0])"
            >
              <div class="relative w-full h-full min-h-[180px] sm:min-h-[250px] overflow-hidden">
                <img
                  v-if="mainImages[0] && !mainImages[0].isPlaceholder"
                  :src="mainImages[0].public_url"
                  :alt="mainImages[0].caption || altText"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-cream-light" />
                <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
              </div>
            </button>
            <button
              class="group cursor-pointer block flex-[1] min-w-0"
              @click="openLightbox(mainImages[1])"
            >
              <div class="relative h-full min-h-[180px] sm:h-auto sm:min-h-0 sm:aspect-[3/4] overflow-hidden">
                <img
                  v-if="mainImages[1] && !mainImages[1].isPlaceholder"
                  :src="mainImages[1].public_url"
                  :alt="mainImages[1].caption || altText"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-cream-light" />
                <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
              </div>
            </button>
          </div>

          <!-- Row 2 : portrait + wide -->
          <div class="flex flex-row gap-3 sm:gap-4">
            <button
              class="group cursor-pointer block flex-[1] min-w-0"
              @click="openLightbox(mainImages[2])"
            >
              <div class="relative h-full min-h-[180px] sm:h-auto sm:min-h-0 sm:aspect-[3/4] overflow-hidden">
                <img
                  v-if="mainImages[2] && !mainImages[2].isPlaceholder"
                  :src="mainImages[2].public_url"
                  :alt="mainImages[2].caption || altText"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-cream-light" />
                <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
              </div>
            </button>
            <button
              class="group cursor-pointer block flex-[2] min-w-0"
              @click="openLightbox(mainImages[3])"
            >
              <div class="relative w-full h-full min-h-[180px] sm:min-h-[250px] overflow-hidden">
                <img
                  v-if="mainImages[3] && !mainImages[3].isPlaceholder"
                  :src="mainImages[3].public_url"
                  :alt="mainImages[3].caption || altText"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-cream-light" />
                <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
              </div>
            </button>
          </div>

          <!-- Row 3 : wide + portrait -->
          <div class="flex flex-row gap-3 sm:gap-4">
            <button
              class="group cursor-pointer block flex-[2] min-w-0"
              @click="openLightbox(mainImages[4])"
            >
              <div class="relative w-full h-full min-h-[180px] sm:min-h-[250px] overflow-hidden">
                <img
                  v-if="mainImages[4] && !mainImages[4].isPlaceholder"
                  :src="mainImages[4].public_url"
                  :alt="mainImages[4].caption || altText"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-cream-light" />
                <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
              </div>
            </button>
            <button
              class="group cursor-pointer block flex-[1] min-w-0"
              @click="openLightbox(mainImages[5])"
            >
              <div class="relative h-full min-h-[180px] sm:h-auto sm:min-h-0 sm:aspect-[3/4] overflow-hidden">
                <img
                  v-if="mainImages[5] && !mainImages[5].isPlaceholder"
                  :src="mainImages[5].public_url"
                  :alt="mainImages[5].caption || altText"
                  loading="lazy"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div v-else class="absolute inset-0 bg-cream-light" />
                <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
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
            <div class="relative w-full h-full min-h-[100px] overflow-hidden">
              <img
                v-if="!img.isPlaceholder"
                :src="img.public_url"
                :alt="img.caption || altText"
                loading="lazy"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div v-else class="absolute inset-0 bg-cream-light" />
              <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/8 transition-colors duration-500" />
              <div
                v-if="i === sideImages.length - 1 && remainingCount > 0"
                class="absolute inset-0 bg-dark/40 flex items-center justify-center group-hover:bg-dark/50 transition-colors duration-500"
              >
                <span class="text-cream font-heading text-4xl md:text-5xl font-medium">
                  +{{ remainingCount }}
                </span>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="images"
      :title="lightboxTitle"
      :start-index="lightboxIndex"
      @close="lightboxOpen = false"
    />
  </section>
</template>

<script setup>
// Grille de 9 photos + visionneuse. Les photos viennent des emplacements
// choisis dans le tableau de bord (page « Photos ») : grid = les 9 cases,
// viewer = les photos en plus, visibles seulement dans la visionneuse.
const props = defineProps({
  // Page du site : home, wedding ou events
  page: { type: String, required: true },
  tagline: { type: String, required: true },
  title: { type: String, required: true },
  altText: { type: String, required: true },
  lightboxTitle: { type: String, required: true },
  bgClass: { type: String, default: "bg-cream-light" },
});

const TOTAL_SLOTS = 9;

const grid = ref(Array(TOTAL_SLOTS).fill(null));
const viewer = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

// Case vide : bloc neutre, non cliquable
const allDisplayImages = computed(() =>
  grid.value.map(
    (img, i) => img ?? { id: `empty-${i}`, public_url: null, caption: null, isPlaceholder: true }
  )
);

// La visionneuse montre les 9 cases (dans l'ordre), puis les photos en plus
const images = computed(() => [
  ...grid.value.filter(Boolean),
  ...viewer.value,
]);

const openLightbox = (img) => {
  if (!img || img.isPlaceholder) return;
  const idx = images.value.findIndex((r) => r.id === img.id);
  if (idx < 0) return;
  lightboxIndex.value = idx;
  lightboxOpen.value = true;
};

const mainImages = computed(() => allDisplayImages.value.slice(0, 6));
const sideImages = computed(() => allDisplayImages.value.slice(6, 9));
// Photos en plus, visibles dans la visionneuse (« +N » sur la dernière case)
const remainingCount = computed(() => viewer.value.length);

const { locale } = useI18n();
// La langue choisit la légende (anglaise pour "en" et "ja")
const { data } = await useFetch(`/api/photos/${props.page}`, {
  query: { locale },
});
if (data.value?.data) {
  grid.value = data.value.data.grid ?? grid.value;
  viewer.value = data.value.data.viewer ?? [];
}
</script>
