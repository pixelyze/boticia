<template>
  <div>
    <!-- Hero -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("weddings.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("weddings.title") }}
            </h1>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("weddings.intro") }}
            </p>
            <Button
              variant="primary"
              icon="MoveRight"
              :to="localePath('/devis')"
              class="mt-8"
            >
              {{ $t("weddings.cta") }}
            </Button>
          </div>
          <!-- Visual: steps -->
          <div class="space-y-5">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="flex items-start gap-4 bg-white rounded-2xl px-6 py-5"
            >
              <div
                class="w-12 h-12 rounded-xl bg-cream-light flex items-center
                       justify-center shrink-0"
              >
                <IconLucid :name="step.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <div>
                <h3 class="font-heading text-lg text-dark mb-1">
                  {{ step.title }}
                </h3>
                <p class="text-dark/70 leading-relaxed text-base">
                  {{ step.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- A la carte -->
    <AlaCarteSection />

    <!-- Wedding gallery -->
    <section
      v-if="galleryImages.length > 0"
      class="py-16 md:py-24 bg-white"
    >
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <span class="section-tagline">
            {{ $t("weddings.gallery_tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("weddings.gallery_title") }}
          </h2>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-3 gap-4
                 max-w-4xl mx-auto"
        >
          <button
            v-for="(img, i) in galleryImages"
            :key="img.id"
            class="group cursor-pointer"
            @click="openLightbox(i)"
          >
            <div
              class="relative w-full h-48 md:h-64
                     rounded-[1.5rem] overflow-hidden"
            >
              <img
                :src="img.public_url"
                :alt="img.caption || ''"
                class="absolute inset-0 w-full h-full
                       object-cover group-hover:scale-105
                       transition-transform duration-500"
              />
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("weddings.cta_title") }}
        </h2>
        <p class="text-dark/60 mb-8 text-lg max-w-xl mx-auto">
          {{ $t("weddings.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
          {{ $t("weddings.cta") }}
        </Button>
      </div>
    </section>

    <GalleryLightbox
      :is-open="lightboxOpen"
      :items="galleryImages"
      :title="$t('weddings.gallery_title')"
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
  title: t("weddings.title") + " - Boticia",
  meta: [{ name: "description", content: t("weddings.intro") }],
});

const steps = computed(() => [
  {
    icon: "MessageCircle",
    title: t("weddings.step_1_title"),
    desc: t("weddings.step_1_desc"),
  },
  {
    icon: "Palette",
    title: t("weddings.step_2_title"),
    desc: t("weddings.step_2_desc"),
  },
  {
    icon: "Flower2",
    title: t("weddings.step_3_title"),
    desc: t("weddings.step_3_desc"),
  },
]);

const galleryImages = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};

const { data: galleryData } = await useFetch(
  "/api/galleries/wedding"
);
if (galleryData.value?.data) {
  galleryImages.value = galleryData.value.data;
}
</script>
