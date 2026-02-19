<template>
  <section class="py-16 md:py-24 bg-cream-light overflow-hidden">
    <div class="px-10 mb-10">
      <span class="section-tagline">{{ $t('stories.tagline') }}</span>
      <h2 class="section-title-lg">{{ $t('stories.title') }}</h2>
    </div>

    <!-- Grid -->
    <div
      class="grid grid-cols-3 md:grid-cols-6 gap-4 px-10"
    >
      <button
        v-for="(story, i) in stories"
        :key="i"
        class="group text-left w-full cursor-pointer"
        @click="onStoryClick(story)"
      >
        <div
          class="relative w-full h-72 md:h-96 rounded-[1.5rem] overflow-hidden border-2 border-dark/10"
        >
          <!-- Image or placeholder -->
          <img
            v-if="story.image"
            :src="story.image"
            :alt="story.label"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            v-else
            class="absolute inset-0"
            :class="story.bg"
          />

          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

          <!-- Label -->
          <div class="absolute bottom-0 inset-x-0 p-5">
            <span class="text-cream text-base font-semibold leading-tight">
              {{ story.label }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- Gallery Lightbox -->
    <GalleryLightbox
      :is-open="lightboxOpen"
      :category-slug="lightboxSlug"
      :category-id="lightboxCategoryId"
      @close="lightboxOpen = false"
    />
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

const FALLBACK_GRADIENTS = [
  'bg-gradient-to-br from-cream to-dark/20',
  'bg-gradient-to-br from-cream to-dark/20',
  'bg-gradient-to-br from-dark/10 to-dark/30',
  'bg-gradient-to-br from-cream to-dark/15',
  'bg-gradient-to-br from-dark/5 to-dark/25',
  'bg-gradient-to-br from-cream to-dark/20',
];

const { data: apiData } = await useFetch(
  '/api/inspirations/homepage'
);

// Lightbox state
const lightboxOpen = ref(false);
const lightboxSlug = ref('');
const lightboxCategoryId = ref('');

const stories = computed(() => {
  const cats = apiData.value?.data;

  if (cats && cats.length > 0) {
    return cats.map((cat, i) => ({
      id: cat.id,
      slug: cat.slug,
      label: t('stories.' + cat.slug),
      image: cat.cover_public_url || null,
      bg: FALLBACK_GRADIENTS[i] || FALLBACK_GRADIENTS[0],
      link: localePath(cat.link || '/pricing'),
    }));
  }

  // Fallback hardcoded
  return [
    {
      label: t('stories.story_1'),
      image: '/bouquet_mariee_boticia._1.webp',
      link: localePath('/pricing'),
      bg: FALLBACK_GRADIENTS[0],
    },
    {
      label: t('stories.story_2'),
      bg: FALLBACK_GRADIENTS[1],
      link: localePath('/pricing'),
    },
    {
      label: t('stories.story_3'),
      bg: FALLBACK_GRADIENTS[2],
      link: localePath('/events'),
    },
    {
      label: t('stories.story_4'),
      bg: FALLBACK_GRADIENTS[3],
      link: localePath('/workshops'),
    },
    {
      label: t('stories.story_5'),
      bg: FALLBACK_GRADIENTS[4],
      link: localePath('/contact'),
    },
    {
      label: t('stories.story_6'),
      bg: FALLBACK_GRADIENTS[5],
      link: localePath('/pricing'),
    },
  ];
});

const onStoryClick = (story) => {
  // If story has an id from the API, open the lightbox
  if (story.id) {
    lightboxSlug.value = story.slug;
    lightboxCategoryId.value = story.id;
    lightboxOpen.value = true;
  } else {
    // Fallback: navigate to link
    navigateTo(story.link);
  }
};
</script>
