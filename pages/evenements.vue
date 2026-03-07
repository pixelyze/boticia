<template>
  <div>
    <!-- Hero + Services carousel -->
    <section class="py-20 md:py-28 bg-cream-light overflow-hidden">
      <div class="px-6 md:px-[4.5rem]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("events.tagline") }}
            </span>
            <h1 class="section-title-lg">
              {{ $t("events.title") }}
            </h1>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("events.intro") }}
            </p>
            <Button
              variant="primary"
              icon="MoveRight"
              :to="localePath('/devis')"
              class="mt-8"
            >
              {{ $t("events.cta") }}
            </Button>
          </div>

          <!-- Carousel -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="font-heading text-lg text-dark">
                {{ $t("events.services_title") }}
              </span>
              <div class="flex gap-2">
                <button
                  ref="prevBtn"
                  class="w-9 h-9 rounded-full border border-dark/20
                         flex items-center justify-center
                         hover:bg-dark hover:text-cream transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="isBeginning"
                >
                  <IconLucid name="ChevronLeft" size="sm" />
                </button>
                <button
                  ref="nextBtn"
                  class="w-9 h-9 rounded-full border border-dark/20
                         flex items-center justify-center
                         hover:bg-dark hover:text-cream transition-colors
                         disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="isEnd"
                >
                  <IconLucid name="ChevronRight" size="sm" />
                </button>
              </div>
            </div>

            <Swiper
              :modules="[Navigation]"
              :slides-per-view="1.6"
              :space-between="10"
              :navigation="{
                prevEl: prevBtn,
                nextEl: nextBtn,
              }"
              @swiper="onSwiper"
              @slide-change="onSlideChange"
            >
              <SwiperSlide
                v-for="(service, i) in services"
                :key="i"
              >
                <div class="bg-white rounded-2xl overflow-hidden flex flex-col h-full">
                  <div class="relative w-full h-64 overflow-hidden">
                    <img
                      :src="service.image"
                      :alt="service.title"
                      class="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div class="px-5 py-6 flex flex-col flex-1">
                    <h3 class="font-heading text-lg text-dark mb-2">
                      {{ service.title }}
                    </h3>
                    <p class="text-dark/70 leading-relaxed text-base flex-1">
                      {{ service.desc }}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <!-- Progress bar -->
            <div class="mt-6">
              <div class="h-0.5 bg-dark/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-dark/40 rounded-full transition-all duration-300"
                  :style="{ width: progressWidth }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="py-16 md:py-24 bg-white">
      <div class="px-6 md:px-[4.5rem]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <!-- Image -->
          <div class="relative w-full h-80 md:h-[28rem] rounded-[2rem] overflow-hidden">
            <img
              :src="philosophyImage"
              :alt="$t('events.philosophy_title')"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <!-- Text -->
          <div>
            <span class="section-tagline">
              {{ $t("events.philosophy_tagline") }}
            </span>
            <h2 class="section-title-lg">
              {{ $t("events.philosophy_title") }}
            </h2>
            <p class="mt-6 text-dark/70 text-lg leading-relaxed">
              {{ $t("events.philosophy_p1") }}
            </p>
            <p class="mt-4 text-dark/70 text-lg leading-relaxed">
              {{ $t("events.philosophy_p2") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="py-16 md:py-24 bg-cream-light">
      <div class="px-6 md:px-[4.5rem]">
        <div class="text-center mb-12">
          <span class="section-tagline">
            {{ $t("events.gallery_tagline") }}
          </span>
          <h2 class="section-title-lg">
            {{ $t("events.gallery_title") }}
          </h2>
          <p class="mt-4 text-dark/70 max-w-2xl mx-auto text-lg leading-relaxed">
            {{ $t("events.gallery_desc") }}
          </p>
        </div>
        <div class="max-w-7xl mx-auto grid grid-cols-2 gap-4">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            class="relative rounded-[1.5rem] overflow-hidden aspect-[3/4]"
          >
            <img
              :src="img.src"
              :alt="img.alt"
              class="absolute inset-0 w-full h-full object-cover
                     hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="font-heading text-2xl md:text-3xl text-dark mb-4">
          {{ $t("events.cta_title") }}
        </h2>
        <p class="text-dark/70 mb-8 text-lg max-w-xl mx-auto">
          {{ $t("events.cta_desc") }}
        </p>
        <Button variant="primary" icon="MoveRight" :to="localePath('/devis')">
          {{ $t("events.cta") }}
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";

definePageMeta({
  layout: "homepage",
  pageTransition: false,
});

const { t } = useI18n();
const localePath = useLocalePath();

const prevBtn = ref(null);
const nextBtn = ref(null);
const isBeginning = ref(true);
const isEnd = ref(false);
const swiperProgress = ref(0);

const progressWidth = computed(() => {
  const min = 15;
  const scaled = min + swiperProgress.value * (100 - min);
  return `${scaled}%`;
});

const onSwiper = (swiper) => {
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.isEnd;
};

const onSlideChange = (swiper) => {
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.isEnd;
  swiperProgress.value = swiper.progress;
};

useHead({
  title: t("events.title") + " - Boticia",
  meta: [{ name: "description", content: t("events.intro") }],
});

const services = computed(() => [
  {
    image: "/api/storage/object/public/homepage-inspirations/events/scenographie.jpg",
    title: t("events.service_1_title"),
    desc: t("events.service_1_desc"),
  },
  {
    image: "/api/storage/object/public/homepage-inspirations/events/corporate.jpg",
    title: t("events.service_2_title"),
    desc: t("events.service_2_desc"),
  },
  {
    image: "/api/storage/object/public/homepage-inspirations/events/corner.jpg",
    title: t("events.service_3_title"),
    desc: t("events.service_3_desc"),
  },
  {
    image: "/api/storage/object/public/homepage-inspirations/events/shooting.jpg",
    title: t("events.service_4_title"),
    desc: t("events.service_4_desc"),
  },
]);

const philosophyImage = "/api/storage/object/public/homepage-inspirations/events/scenographie.jpg";

const galleryImages = [
  { src: "/api/storage/object/public/homepage-inspirations/events/corporate.jpg", alt: "Set de table floral" },
  { src: "/api/storage/object/public/homepage-inspirations/events/gallery-arrangement-floral-boticia.jpg", alt: "Arrangement floral Boticia" },
  { src: "/api/storage/object/public/homepage-inspirations/events/gallery-bouquet-shooting-photo-boticia.jpg", alt: "Bouquet shooting photo Boticia" },
  { src: "/api/storage/object/public/homepage-inspirations/events/gallery-scenographie-florale-boticia.jpg", alt: "Scénographie florale Boticia" },
  { src: "/api/storage/object/public/homepage-inspirations/events/scenographie.jpg", alt: "Scénographie florale événementielle" },
  { src: "/api/storage/object/public/homepage-inspirations/events/gallery-set-design-creation-florale-boticia.jpg", alt: "Set design création florale" },
];
</script>
