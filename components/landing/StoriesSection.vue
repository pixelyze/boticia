<template>
  <section class="py-16 md:py-24 bg-cream-light overflow-hidden">
    <div class="px-5 sm:px-10 mb-10 flex items-end justify-between">
      <div>
        <span class="section-tagline">{{ $t('stories.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('stories.title') }}</h2>
      </div>

      <!-- Navigation -->
      <div class="flex items-center gap-3">
        <div class="flex gap-2">
          <button
            ref="prevBtn"
            class="w-10 h-10 rounded-full border border-dark/20
                   flex items-center justify-center
                   hover:bg-dark hover:text-cream transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="isBeginning"
          >
            <IconLucid name="ChevronLeft" size="sm" />
          </button>
          <button
            ref="nextBtn"
            class="w-10 h-10 rounded-full border border-dark/20
                   flex items-center justify-center
                   hover:bg-dark hover:text-cream transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="isEnd"
          >
            <IconLucid name="ChevronRight" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <!-- Swiper -->
    <div class="px-5 sm:px-10">
      <Swiper
        :modules="[Navigation]"
        :slides-per-view="1.3"
        :space-between="12"
        :slides-per-group="1"
        :breakpoints="{
          640: { slidesPerView: 2.5, spaceBetween: 16, slidesPerGroup: 2 },
          1024: { slidesPerView: 3.5, spaceBetween: 16, slidesPerGroup: 3 },
        }"
        :navigation="{
          prevEl: prevBtn,
          nextEl: nextBtn,
        }"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
        @touch-start="isSwiping = false"
        @touch-move="isSwiping = true"
      >
        <SwiperSlide
          v-for="(story, i) in stories"
          :key="i"
        >
          <button
            class="group text-left w-full cursor-pointer"
            @click="!isSwiping && onStoryClick(story)"
          >
            <div
              class="relative w-full h-72 md:h-96 rounded-[1.5rem]
                     overflow-hidden"
            >
              <img
                v-if="story.image"
                :src="story.image"
                :alt="story.label"
                loading="lazy"
                width="600"
                height="900"
                class="absolute inset-0 w-full h-full object-cover
                       group-hover:scale-105 transition-transform
                       duration-500"
              />
              <div
                v-else
                class="absolute inset-0"
                :class="story.bg"
              />

              <!-- Gradient overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t
                       from-dark/60 via-transparent to-transparent"
              />

              <!-- Label -->
              <div class="absolute bottom-0 inset-x-0 p-3 sm:p-5">
                <span
                  class="text-cream text-sm sm:text-base
                         font-semibold leading-tight"
                >
                  {{ story.label }}
                </span>
              </div>
            </div>
          </button>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Progress bar -->
    <div class="mt-8 mx-5 sm:mx-10 h-[3px] bg-dark/10 rounded-full overflow-hidden">
      <div
        class="h-full bg-dark/60 rounded-full transition-all duration-300 ease-out"
        :style="{ width: progressWidth }"
      />
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

const prevBtn = ref(null);
const nextBtn = ref(null);
const isBeginning = ref(true);
const isEnd = ref(false);
const progressWidth = ref('15%');

let swiperInstance = null;
const isSwiping = ref(false);

const updateProgress = (swiper) => {
  const total = swiper.slides.length;
  const visible = swiper.params.slidesPerView;
  const maxIndex = total - visible;
  if (maxIndex <= 0) {
    progressWidth.value = '100%';
  } else {
    const minPct = 15;
    const pct = minPct + ((swiper.activeIndex / maxIndex) * (100 - minPct));
    progressWidth.value = `${Math.min(pct, 100)}%`;
  }
};

const onSwiper = (swiper) => {
  swiperInstance = swiper;
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.isEnd;
  updateProgress(swiper);
};

const onSlideChange = (swiper) => {
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.isEnd;
  updateProgress(swiper);
};

const FALLBACK_IMAGES = {
  story_1: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&h=900&fit=crop',
  story_2: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=900&fit=crop',
  story_3: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=900&fit=crop',
  story_4: 'https://images.unsplash.com/photo-1464699908537-0954e50791ee?w=600&h=900&fit=crop',
  story_5: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=900&fit=crop',
  story_6: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&h=900&fit=crop',
};

const FALLBACK_GRADIENTS = [
  'bg-gradient-to-br from-cream to-dark/20',
  'bg-gradient-to-br from-cream to-dark/20',
  'bg-gradient-to-br from-dark/10 to-dark/30',
  'bg-gradient-to-br from-cream to-dark/15',
  'bg-gradient-to-br from-dark/5 to-dark/25',
  'bg-gradient-to-br from-cream to-dark/20',
];

const { data: apiData } = useFetch(
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
      label: cat.title || t('stories.' + cat.slug),
      image: cat.cover_public_url || FALLBACK_IMAGES[cat.slug] || null,
      bg: FALLBACK_GRADIENTS[i] || FALLBACK_GRADIENTS[0],
      link: localePath(cat.link || '/pricing'),
    }));
  }

  // Fallback with Unsplash images
  return [
    {
      label: t('stories.story_1'),
      image: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&h=900&fit=crop',
      link: localePath('/mariages'),
      bg: FALLBACK_GRADIENTS[0],
    },
    {
      label: t('stories.story_2'),
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=900&fit=crop',
      link: localePath('/mariages'),
      bg: FALLBACK_GRADIENTS[1],
    },
    {
      label: t('stories.story_3'),
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=900&fit=crop',
      link: localePath('/evenements'),
      bg: FALLBACK_GRADIENTS[2],
    },
    {
      label: t('stories.story_4'),
      image: 'https://images.unsplash.com/photo-1464699908537-0954e50791ee?w=600&h=900&fit=crop',
      link: localePath('/ateliers'),
      bg: FALLBACK_GRADIENTS[3],
    },
    {
      label: t('stories.story_5'),
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=900&fit=crop',
      link: localePath('/evenements'),
      bg: FALLBACK_GRADIENTS[4],
    },
    {
      label: t('stories.story_6'),
      image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&h=900&fit=crop',
      link: localePath('/mariages'),
      bg: FALLBACK_GRADIENTS[5],
    },
  ];
});

const onStoryClick = (story) => {
  if (story.id) {
    lightboxSlug.value = story.slug;
    lightboxCategoryId.value = story.id;
    lightboxOpen.value = true;
  } else {
    navigateTo(story.link);
  }
};
</script>
