<template>
  <div>
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-6">
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="section-tagline">
            {{ $t("creations.tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("creations.title") }}
          </h2>
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

        <!-- Categories grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 gap-5
                 max-w-4xl mx-auto"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="group text-left cursor-pointer"
            @click="openLightbox(cat)"
          >
            <div
              class="relative w-full h-72 md:h-96 rounded-[1.5rem]
                     overflow-hidden border-2 border-dark/10"
            >
              <img
                v-if="cat.cover_public_url"
                :src="cat.cover_public_url"
                :alt="$t('stories.' + cat.slug)"
                class="absolute inset-0 w-full h-full object-cover
                       group-hover:scale-105 transition-transform
                       duration-500"
              />
              <div
                v-else
                class="absolute inset-0 bg-gradient-to-br
                       from-cream to-dark/15"
              />

              <!-- Gradient overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t
                       from-dark/60 via-transparent to-transparent"
              />

              <!-- Label -->
              <div class="absolute bottom-0 inset-x-0 p-5">
                <span
                  class="text-cream text-base font-semibold
                         leading-tight"
                >
                  {{ $t("stories." + cat.slug) }}
                </span>
              </div>
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
  title: t("creations.title") + " - Boticia",
  meta: [
    {
      name: "description",
      content: t("creations.subtitle"),
    },
  ],
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
