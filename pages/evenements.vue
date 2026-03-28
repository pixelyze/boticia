<template>
  <div>
    <!-- Hero + Services -->
    <section class="py-20 md:py-28 bg-cream-light">
      <div class="container mx-auto px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
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
          <!-- Visual: services -->
          <div class="space-y-5">
            <div
              v-for="(service, i) in services"
              :key="i"
              class="flex items-start gap-4 bg-white rounded-2xl px-6 py-5"
            >
              <div
                class="w-12 h-12 rounded-xl bg-cream-light flex items-center
                       justify-center shrink-0"
              >
                <IconLucid :name="service.icon" size="md" :stroke-width="2" class="text-dark" />
              </div>
              <div>
                <h3 class="font-heading text-lg text-dark mb-1">
                  {{ service.title }}
                </h3>
                <p class="text-dark/70 leading-relaxed text-base">
                  {{ service.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-6">
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
      <div class="container mx-auto px-6">
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
        <div class="max-w-5xl mx-auto columns-2 sm:columns-3 gap-4 space-y-4">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            class="rounded-2xl overflow-hidden ring-1 ring-dark/5 break-inside-avoid"
            :class="i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-square'"
          >
            <img
              :src="img.src"
              :alt="img.alt"
              class="w-full h-full object-cover
                     hover:scale-105 transition-transform duration-500"
              loading="lazy"
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

definePageMeta({
  layout: "homepage",
  pageTransition: false,
});

const { t } = useI18n();
const localePath = useLocalePath();

useHead({
  title: t("events.title") + " - Boticia",
  meta: [{ name: "description", content: t("events.intro") }],
});

const services = computed(() => [
  {
    icon: "Sparkles",
    title: t("events.service_1_title"),
    desc: t("events.service_1_desc"),
  },
  {
    icon: "Building2",
    title: t("events.service_2_title"),
    desc: t("events.service_2_desc"),
  },
  {
    icon: "Flower2",
    title: t("events.service_3_title"),
    desc: t("events.service_3_desc"),
  },
  {
    icon: "Camera",
    title: t("events.service_4_title"),
    desc: t("events.service_4_desc"),
  },
]);

const philosophyImage = "/images/events/scenographie-florale-boticia.jpg";

const galleryImages = [
  { src: "/images/events/composition_florale_table_mariage_boticia.jpg", alt: "Set de table floral" },
  { src: "/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg", alt: "Arrangement floral Boticia" },
  { src: "/images/events/decoration_florale_mariage_sophiethomas_boticia_11.jpg", alt: "Décoration florale événementielle" },
  { src: "/images/events/scenographie-florale-boticia.jpg", alt: "Scénographie florale Boticia" },
  { src: "/images/events/decoration_florale_mariage_sophiethomas_boticia_42.jpg", alt: "Scénographie florale événementielle" },
  { src: "/images/events/atelier_composition_florale_team_building_boticia_3.jpg", alt: "Atelier composition florale" },
];
</script>
