<template>
  <section class="py-16 md:py-24 bg-cream overflow-hidden">
    <div class="px-10 mb-10">
      <span class="section-tagline">{{ $t('stories.tagline') }}</span>
      <h2 class="section-title-lg">{{ $t('stories.title') }}</h2>
    </div>

    <!-- Horizontal scroll -->
    <div
      class="grid grid-cols-3 md:grid-cols-6 gap-4 px-10"
    >
      <NuxtLink
        v-for="(story, i) in stories"
        :key="i"
        :to="story.link"
        class="group"
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
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const localePath = useLocalePath();

const scrollContainer = ref(null);
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

const startDrag = (e) => {
  isDragging = true;
  startX = e.pageX - scrollContainer.value.offsetLeft;
  scrollLeft = scrollContainer.value.scrollLeft;
};

const onDrag = (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.value.offsetLeft;
  const walk = (x - startX) * 1.5;
  scrollContainer.value.scrollLeft = scrollLeft - walk;
};

const stopDrag = () => {
  isDragging = false;
};

const stories = computed(() => [
  {
    label: t('stories.story_1'),
    image: '/bouquet_mariee_boticia._1.webp',
    link: localePath('/pricing'),
  },
  {
    label: t('stories.story_2'),
    bg: 'bg-gradient-to-br from-cream to-dark/20',
    link: localePath('/pricing'),
  },
  {
    label: t('stories.story_3'),
    bg: 'bg-gradient-to-br from-dark/10 to-dark/30',
    link: localePath('/events'),
  },
  {
    label: t('stories.story_4'),
    bg: 'bg-gradient-to-br from-cream to-dark/15',
    link: localePath('/workshops'),
  },
  {
    label: t('stories.story_5'),
    bg: 'bg-gradient-to-br from-dark/5 to-dark/25',
    link: localePath('/contact'),
  },
  {
    label: t('stories.story_6'),
    bg: 'bg-gradient-to-br from-cream to-dark/20',
    link: localePath('/pricing'),
  },
]);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
