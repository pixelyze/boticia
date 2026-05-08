<template>
  <section class="py-20 md:py-28 bg-white overflow-hidden">
    <div class="container mx-auto px-6 mb-12">
      <div class="relative text-center">
        <span class="section-tagline">{{ $t('testimonials.tagline') }}</span>
        <h2 class="section-title-lg">{{ $t('testimonials.title') }}</h2>
        <!-- Boutons navigation — desktop uniquement -->
        <div class="hidden md:flex items-center gap-2 absolute right-0 bottom-0">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-dark/15 bg-white text-dark transition-all hover:border-dark/40 hover:bg-dark hover:text-white"
            @click="scroll(-1)"
            :aria-label="$t('testimonials.prev')"
          >
            <IconLucid name="ArrowLeft" size="sm" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-dark/15 bg-white text-dark transition-all hover:border-dark/40 hover:bg-dark hover:text-white"
            @click="scroll(1)"
            :aria-label="$t('testimonials.next')"
          >
            <IconLucid name="ArrowRight" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <!-- Conteneur scrollable -->
    <div class="relative">
      <!-- Masque gauche — desktop uniquement -->
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 hidden md:block w-32 bg-gradient-to-r from-white to-transparent" />
      <!-- Masque droite — toujours visible -->
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent md:w-32" />

      <!-- Track scrollable -->
      <div
        ref="trackRef"
        class="flex gap-5 overflow-x-auto pl-6 pr-6"
        style="scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: auto;"
        @mouseenter="pauseAuto"
        @mouseleave="resumeAuto"
      >
        <!-- Cartes dupliquées pour boucle infinie -->
        <template v-for="loop in 2" :key="loop">
          <blockquote
            v-for="(item, index) in testimonials"
            :key="`${loop}-${index}`"
            class="flex w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-dark/10 bg-cream/30 p-7 sm:w-[380px]"
          >
            <p class="leading-relaxed text-dark/70 italic">
              « {{ item.text }} »
            </p>
            <footer class="mt-6 flex items-center gap-3 border-t border-dark/10 pt-4">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-dark text-sm font-medium text-white shrink-0">
                {{ item.name.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-medium text-dark">{{ item.name }}</p>
                <p v-if="item.location" class="text-xs text-dark/50">{{ item.location }}</p>
              </div>
            </footer>
          </blockquote>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const testimonials = computed(() => [
  {
    text: t("testimonials.items.0.text"),
    name: t("testimonials.items.0.name"),
    location: t("testimonials.items.0.location"),
  },
  {
    text: t("testimonials.items.1.text"),
    name: t("testimonials.items.1.name"),
    location: t("testimonials.items.1.location"),
  },
  {
    text: t("testimonials.items.2.text"),
    name: t("testimonials.items.2.name"),
    location: t("testimonials.items.2.location"),
  },
  {
    text: t("testimonials.items.3.text"),
    name: t("testimonials.items.3.name"),
    location: t("testimonials.items.3.location"),
  },
  {
    text: t("testimonials.items.4.text"),
    name: t("testimonials.items.4.name"),
    location: t("testimonials.items.4.location"),
  },
]);

const trackRef = ref<HTMLElement | null>(null);
const CARD_WIDTH = 405; // largeur carte + gap
let rafId: number | null = null;
let isManualScrolling = false;
let isHovered = false;

// Normalise scrollLeft dans la première moitié (boucle infinie)
const normalizeScroll = (el: HTMLElement) => {
  const half = el.scrollWidth / 2;
  if (el.scrollLeft >= half) el.scrollLeft -= half;
  else if (el.scrollLeft < 0) el.scrollLeft += half;
};

// Auto-scroll via requestAnimationFrame
let lastTime = 0;
const autoTick = (time: number) => {
  rafId = requestAnimationFrame(autoTick);
  if (isManualScrolling || isHovered) {
    lastTime = time;
    return;
  }
  const delta = time - lastTime;
  lastTime = time;
  if (!trackRef.value || delta > 100) return; // skip si tab en arrière-plan
  trackRef.value.scrollLeft += delta * 0.04; // ~40px/s
  normalizeScroll(trackRef.value);
};

// Boutons : animation manuelle sans conflit avec autoTick
const scroll = (direction: 1 | -1) => {
  if (!trackRef.value) return;
  isManualScrolling = true;

  const el = trackRef.value;
  const start = el.scrollLeft;
  const target = start + direction * CARD_WIDTH;
  const startTime = performance.now();
  const duration = 380;

  const animate = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.scrollLeft = start + (target - start) * ease;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      normalizeScroll(el);
      lastTime = performance.now();
      isManualScrolling = false;
    }
  };

  requestAnimationFrame(animate);
};

const pauseAuto = () => { isHovered = true; };
const resumeAuto = () => { isHovered = false; };

onMounted(() => {
  if (window.innerWidth >= 768) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(autoTick);
  }
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
div::-webkit-scrollbar {
  display: none;
}
</style>
