<template>
  <section class="py-20 md:py-28 bg-white overflow-hidden">
    <div class="container mx-auto px-6 mb-12">
      <div class="flex items-end justify-between">
        <div class="text-center flex-1">
          <span class="section-tagline">{{ $t('testimonials.tagline') }}</span>
          <h2 class="section-title-lg">{{ $t('testimonials.title') }}</h2>
        </div>
        <!-- Boutons navigation -->
        <div class="flex items-center gap-2 shrink-0">
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
      <!-- Masques dégradés gauche/droite -->
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent sm:w-32" />
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent sm:w-32" />

      <!-- Track scrollable -->
      <div
        ref="trackRef"
        class="flex gap-5 overflow-x-auto scroll-smooth pl-6 pr-6"
        style="scrollbar-width: none; -ms-overflow-style: none;"
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
const CARD_WIDTH = 400; // px par carte + gap
let autoTimer: ReturnType<typeof setInterval> | null = null;
let isPaused = false;

const scroll = (direction: 1 | -1) => {
  if (!trackRef.value) return;
  pauseAuto();
  trackRef.value.scrollBy({ left: direction * CARD_WIDTH, behavior: "smooth" });
  setTimeout(resumeAuto, 2000);
};

const tick = () => {
  if (!trackRef.value || isPaused) return;
  const el = trackRef.value;
  el.scrollLeft += 1;
  // Réinitialisation silencieuse à mi-chemin (contenu dupliqué)
  if (el.scrollLeft >= el.scrollWidth / 2) {
    el.scrollLeft = 0;
  }
};

const pauseAuto = () => {
  isPaused = true;
};

const resumeAuto = () => {
  isPaused = false;
};

onMounted(() => {
  autoTimer = setInterval(tick, 20);
});

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer);
});
</script>

<style scoped>
div::-webkit-scrollbar {
  display: none;
}
</style>
